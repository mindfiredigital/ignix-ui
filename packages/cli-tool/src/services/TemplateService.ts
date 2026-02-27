import axios from 'axios';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { RegistryService } from './RegistryService';
import { loadConfig } from '../utils/config';
import { logger } from '../utils/logger';
import { DependencyService } from './DependencyService';
import { ComponentService } from './ComponentService';

export class TemplateService {
  private registryService = new RegistryService();
  private dependencyService = new DependencyService();
  private componentService = new ComponentService();
  private config = loadConfig();

  private async safeWriteFile(filePath: string, content: string) {
    if (await fs.pathExists(filePath)) {
      logger.warn(`Skipping existing file (template): ${filePath}`);
      return;
    }
    await fs.writeFile(filePath, content);
  }

  public async install(name: string): Promise<void> {
    const spinner = ora(`Installing template layout: ${name}...`).start();

    try {
      const config = await this.config;

      const templateConfig = await this.registryService.getComponentConfig(name);
      if (!templateConfig) {
        throw new Error(`Template '${name}' not found.`);
      }

      // -------------------------------
      // 1. Install NPM dependencies
      // -------------------------------
      if (templateConfig.dependencies?.length) {
        spinner.text = `Installing dependencies for ${name}...`;
        await this.dependencyService.install(templateConfig.dependencies, false);
      }

      // -------------------------------
      // 2. Install internal components
      // -------------------------------
      if (templateConfig.componentDependencies?.length) {
        spinner.text = `Installing internal component dependencies...`;

        for (const dep of templateConfig.componentDependencies) {
          await this.componentService.install(dep);
        }
      }

      // -------------------------------
      // 3. Resolve template directory SAFELY
      // -------------------------------
      const templateBaseDir =
        config.templateDir ||
        config.componentsDir || // fallback
        'src/templates';

      const templateDir = path.resolve(process.cwd(), templateBaseDir, name.toLowerCase());

      await fs.ensureDir(templateDir);

      // -------------------------------
      // 4. Download template files
      // -------------------------------
      spinner.text = `Downloading template layout files...`;

      if (!templateConfig.files || Object.keys(templateConfig.files).length === 0) {
        throw new Error(`Template '${name}' has no files defined in registry.`);
      }

      const baseUrl = config.registryUrl.substring(0, config.registryUrl.lastIndexOf('/'));

      for (const fileKey in templateConfig.files) {
        const fileInfo = templateConfig.files[fileKey];

        if (!fileInfo?.path) {
          logger.warn(`Skipping file with missing path in template '${name}'`);
          continue;
        }

        const fileUrl = `${baseUrl}/${fileInfo.path}`;

        const { data: content } = await axios.get(fileUrl, {
          responseType: 'text',
        });

        const fileName = path.basename(fileInfo.path);
        const filePath = path.join(templateDir, fileName);

        await this.safeWriteFile(filePath, content);
      }

      spinner.succeed(chalk.green(`Template layout installed: ${chalk.cyan(name)}`));
      logger.info(`Template saved at: ${chalk.yellow(templateDir)}`);
    } catch (err) {
      spinner.fail(`Failed to install template: ${name}`);
      if (err instanceof Error) logger.error(err.message);
      process.exit(1);
    }
  }
}
