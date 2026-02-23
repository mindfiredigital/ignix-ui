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

  private silent = false;

  public setSilent(value: boolean): void {
    this.silent = value;
    this.registryService.setSilent?.(value);
    this.componentService.setSilent?.(value);
  }

  private async safeWriteFile(filePath: string, content: string) {
    if (await fs.pathExists(filePath)) {
      if (!this.silent) {
        logger.warn(`Skipping existing file (template): ${filePath}`);
      }
      return;
    }
    await fs.writeFile(filePath, content);
  }

  public async install(name: string): Promise<void> {
    const noop = (): void => {
      return;
    };

    const spinner = this.silent
      ? { start: noop, succeed: noop, fail: noop, text: '' }
      : ora(`Installing template layout: ${name}...`).start();

    try {
      const config = await this.config;

      // IMPORTANT: template uses template registry
      const templateConfig = await this.registryService.getTemplateConfig(name);

      if (!templateConfig) {
        throw new Error(`Template '${name}' not found.`);
      }

      // 1️⃣ Install dependencies
      if (templateConfig.dependencies?.length) {
        if (!this.silent) spinner.text = `Installing dependencies...`;
        await this.dependencyService.install(templateConfig.dependencies, false, this.silent);
      }

      // 2️⃣ Install internal components
      if (templateConfig.componentDependencies?.length) {
        if (!this.silent) spinner.text = `Installing internal components...`;

        for (const dep of templateConfig.componentDependencies) {
          await this.componentService.install(dep);
        }
      }

      // 3️⃣ Download files
      if (!this.silent) spinner.text = `Downloading template files...`;

      const templateDir = path.resolve(config.templateDir, name.toLowerCase());
      await fs.ensureDir(templateDir);

      const baseUrl = config.registryUrl.substring(0, config.registryUrl.lastIndexOf('/'));

      for (const fileKey in templateConfig.files) {
        const fileInfo = templateConfig.files[fileKey];
        const fileUrl = `${baseUrl}/${fileInfo.path}`;

        const { data: content } = await axios.get(fileUrl, {
          responseType: 'text',
        });

        const fileName = path.basename(fileInfo.path);
        const filePath = path.join(templateDir, fileName);

        await this.safeWriteFile(filePath, content);
      }

      if (!this.silent) {
        spinner.succeed(chalk.green(`Template layout installed: ${chalk.cyan(name)}`));
        logger.info(`Template saved at: ${chalk.yellow(templateDir)}`);
      }
    } catch (err) {
      if (!this.silent) {
        spinner.fail(`Failed to install template: ${name}`);
        if (err instanceof Error) logger.error(err.message);
      }

      // 🔥 DO NOT exit here
      throw err;
    }
  }
}
