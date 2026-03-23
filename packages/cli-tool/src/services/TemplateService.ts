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

  public async install(name: string): Promise<void> {
    let spinner: ReturnType<typeof ora> | null = null;

    if (!this.silent) {
      spinner = ora(`Installing template: ${name}...`).start();
    }

    logger.info(`[Template] Starting install: ${name}`);

    try {
      const config = await this.config;

      const templateConfig = await this.registryService.getTemplateConfig(name);

      if (!templateConfig) {
        throw new Error(`Template '${name}' not found.`);
      }

      logger.info('[Template] Template config loaded');

      //--------------------------------------------------
      // Dependencies
      //--------------------------------------------------
      if (templateConfig.dependencies?.length) {
        spinner && (spinner.text = 'Installing dependencies...');
        logger.info('[Template] Installing dependencies');

        await this.dependencyService.install(templateConfig.dependencies, false, this.silent);
      }

      //--------------------------------------------------
      // Internal Components
      //--------------------------------------------------
      if (templateConfig.componentDependencies?.length) {
        spinner && (spinner.text = 'Installing internal components...');
        logger.info('[Template] Installing internal components');

        for (const dep of templateConfig.componentDependencies) {
          logger.info(`[Template] Installing component dependency: ${dep}`);
          await this.componentService.install(dep);
        }
      }

      //--------------------------------------------------
      // Files
      //--------------------------------------------------
      spinner && (spinner.text = 'Downloading template files...');

      const templateDir = path.resolve(config.templateLayoutDir, name.toLowerCase());
      await fs.ensureDir(templateDir);

      const baseUrl = config.registryUrl.replace('/registry.json', '');
      logger.info(`[Template] Base URL: ${baseUrl}`);

      for (const fileKey in templateConfig.files) {
        const fileInfo = templateConfig.files[fileKey];

        const fileUrl = new URL(fileInfo.path, baseUrl + '/').toString();
        logger.info(`[Template] Downloading: ${fileUrl}`);

        const { data: content } = await axios.get(fileUrl, {
          responseType: 'text',
        });

        const fileName = path.basename(fileInfo.path);
        const filePath = path.join(templateDir, fileName);

        await fs.writeFile(filePath, content);

        logger.info(`[Template] Saved: ${filePath}`);
      }

      spinner?.succeed(chalk.green(`Template installed: ${name}`));
      logger.info(`[Template] Install complete: ${name}`);
    } catch (err) {
      spinner?.fail(`Failed to install template: ${name}`);

      logger.error('[Template] Install failed');

      if (axios.isAxiosError(err)) {
        logger.error(`[Axios] ${err.message}`);

        if (err.response) {
          logger.error(`Status: ${err.response.status}`);
          logger.error(`URL: ${err.config?.url}`);
        } else if (err.request) {
          logger.error('No response received from server');
        }
      } else if (err instanceof Error) {
        logger.error(`Reason: ${err.message}`);
      } else {
        logger.error(`Reason: ${String(err)}`);
      }

      throw err;
    }
  }
}
