import axios from 'axios';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { RegistryService } from './RegistryService';
import { loadConfig } from '../utils/config';
import { logger } from '../utils/logger';
import { DependencyService } from './DependencyService';

export class ComponentService {
  private registryService = new RegistryService();
  private dependencyService = new DependencyService();
  private config = loadConfig();

  public async install(name: string): Promise<void> {
    const spinner = ora(`Installing component: ${name}...`).start();

    try {
      const config = await this.config;
      const componentConfig = await this.registryService.getComponentConfig(name);

      if (!componentConfig) {
        throw new Error(`Component '${name}' not found.`);
      }

      // 1. Install dependencies
      if (componentConfig.dependencies && componentConfig.dependencies.length > 0) {
        spinner.text = `Installing dependencies for ${name}...`;
        await this.dependencyService.install(componentConfig.dependencies, false);
      }

      // 2. Fetch and write files
      spinner.text = `Getting component files for ${name}...`;
      const registryBaseUrl = config.registryUrl.substring(0, config.registryUrl.lastIndexOf('/'));
      const installedFiles: string[] = [];
      const componentsDir = path.resolve(config.componentsDir);
      const componentDir = path.join(componentsDir, name.toLowerCase());

      // Create component directory
      await fs.ensureDir(componentDir);

      // Fetch and write each file
      for (const fileKey in componentConfig.files) {
        const fileInfo = componentConfig.files[fileKey];
        const fileUrl = `${registryBaseUrl}/${fileInfo.path}`;

        const { data: content } = await axios.get(fileUrl, { responseType: 'text' });

        // Use path.basename to handle nested file structures within the component folder
        const fileName = path.basename(fileInfo.path);
        const filePath = path.join(componentDir, fileName);

        await fs.writeFile(filePath, content);
        installedFiles.push(filePath);
      }

      spinner.succeed(chalk.green(`Successfully installed component: ${chalk.cyan(name)}`));
      logger.info(`Component files written to ${chalk.yellow(componentDir)}`);
    } catch (error) {
      spinner.fail(`Failed to install component: ${name}.`);
      if (error instanceof Error) {
        logger.error(error.message);
      }
      process.exit(1);
    }
  }
}
