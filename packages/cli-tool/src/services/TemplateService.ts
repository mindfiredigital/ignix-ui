import axios from 'axios';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { RegistryService } from './RegistryService';
import { loadConfig } from '../utils/config';
import { logger } from '../utils/logger';
import { DependencyService } from './DependencyService';

// Define types based on your registry.json structure
interface ComponentFile {
  path: string;
  type: string;
}

interface ComponentConfig {
  id: string;
  name: string;
  description: string;
  dependencies?: string[];
  files: Record<string, ComponentFile>;
}

interface Registry {
  components: Record<string, ComponentConfig>;
}

export class TemplateService {
  private templates: Record<string, Registry> | null = null;
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
      const registryBaseUrl = config.registryUrl.substring(0, config.templateUrl.lastIndexOf('/'));
      const installedFiles: string[] = [];
      const componentsDir = path.resolve(config.templateDir);
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

  public async getAvailableTemplateLayout(): Promise<Registry[]> {
    const templates = await this.fetchTemplates();
    return Object.values(templates);
  }

  private async fetchTemplates(): Promise<Record<string, Registry>> {
    if (this.templates) {
      return this.templates;
    }

    const config = await loadConfig();
    const spinner = ora('Fetching templates...').start();

    try {
      const response = await axios.get<Record<string, Registry>>(config.templateUrl);
      spinner.succeed('Templates fetched successfully');
      this.templates = response.data;
      return this.templates;
    } catch (error) {
      spinner.fail('Failed to fetch templates');
      logger.error('Could not connect to the template registry. Please check your connection.');
      process.exit(1);
    }
  }
}
