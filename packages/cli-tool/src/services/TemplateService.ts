// src/services/TemplateService.ts - Updated version
import axios from 'axios';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { loadConfig } from '../utils/config';
import { DependencyService } from './DependencyService';

export interface TemplateFile {
  path: string;
  content?: string;
  url?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category?: string;
  dependencies?: string[];
  files: TemplateFile[];
  instructions?: string;
}

export class TemplateService {
  private templates: Record<string, TemplateConfig> | null = null;
  private dependencyService = new DependencyService();

  private async fetchTemplates(): Promise<Record<string, TemplateConfig>> {
    if (this.templates) {
      return this.templates;
    }

    console.log('loading templates registry from config URL...');
    const config = await loadConfig();
    console.log('template registry URL:', config.templateUrl);

    const spinner = ora('Fetching templates...').start();

    try {
      const response = await axios.get<Record<string, TemplateConfig>>(config.templateUrl);
      console.log('response data:', response.data);
      spinner.succeed('Templates fetched successfully');
      this.templates = response.data;
      return this.templates;
    } catch (error) {
      spinner.fail('Failed to fetch templates');
      logger.error('Could not connect to the template registry. Please check your connection.');
      process.exit(1);
    }
  }

  public async getTemplateConfig(id: string): Promise<TemplateConfig | undefined> {
    const templates = await this.fetchTemplates();
    return templates[id];
  }

  public async getAvailableTemplates(): Promise<TemplateConfig[]> {
    const templates = await this.fetchTemplates();
    return Object.values(templates);
  }

  public async install(id: string): Promise<void> {
    const spinner = ora(`Installing template: ${id}...`).start();

    try {
      const config = await loadConfig();
      const templateConfig = await this.getTemplateConfig(id);

      if (!templateConfig) {
        throw new Error(`Template '${id}' not found in the registry.`);
      }

      // 1. Install dependencies if any
      if (templateConfig.dependencies && templateConfig.dependencies.length > 0) {
        spinner.text = `Installing dependencies for ${templateConfig.name}...`;
        await this.dependencyService.install(templateConfig.dependencies, false);
      }

      // 2. Create template files
      spinner.text = `Creating template files for ${templateConfig.name}...`;
      const installedFiles: string[] = [];
      const baseDir = process.cwd();

      // Fetch and write each file
      for (const fileInfo of templateConfig.files) {
        let content = fileInfo.content;

        // If content is not provided directly, fetch from URL
        if (!content && fileInfo.url) {
          const { data } = await axios.get(fileInfo.url, { responseType: 'text' });
          content = data;
        }

        if (!content) {
          logger.warn(`No content found for file: ${fileInfo.path}`);
          continue;
        }

        const filePath = path.resolve(baseDir, fileInfo.path);
        const fileDir = path.dirname(filePath);

        // Create directory if it doesn't exist
        await fs.ensureDir(fileDir);

        // Write file
        await fs.writeFile(filePath, content, 'utf8');
        installedFiles.push(filePath);

        // Use the new debug logger
        logger.debug(`Created: ${fileInfo.path}`);
      }

      spinner.succeed(
        chalk.green(`Successfully installed template: ${chalk.cyan(templateConfig.name)}`)
      );

      // Show installation summary
      logger.info(`\n📁 Template files created (${installedFiles.length} files):`);
      installedFiles.forEach((file) => {
        logger.info(`  • ${path.relative(baseDir, file)}`);
      });

      // Show post-installation instructions if available
      if (templateConfig.instructions) {
        logger.info(`\n📋 Next steps:\n${templateConfig.instructions}`);
      }

      logger.info(`\n🎉 Template ${chalk.cyan(templateConfig.name)} is ready to use!`);
    } catch (error) {
      spinner.fail(`Failed to install template: ${id}.`);
      if (error instanceof Error) {
        logger.error(error.message);
      }
      process.exit(1);
    }
  }

  /**
   * Validates if a template can be installed in the current project
   */
  public async validateTemplateInstallation(
    id: string
  ): Promise<{ valid: boolean; conflicts: string[] }> {
    const templateConfig = await this.getTemplateConfig(id);
    const conflicts: string[] = [];

    if (!templateConfig) {
      throw new Error(`Template '${id}' not found.`);
    }

    // Check for file conflicts
    for (const fileInfo of templateConfig.files) {
      const filePath = path.resolve(process.cwd(), fileInfo.path);
      if (await fs.pathExists(filePath)) {
        conflicts.push(fileInfo.path);
      }
    }

    return {
      valid: conflicts.length === 0,
      conflicts,
    };
  }

  /**
   * Gets templates by category for better organization
   */
  public async getTemplatesByCategory(): Promise<Record<string, TemplateConfig[]>> {
    const templates = await this.getAvailableTemplates();

    return templates.reduce((acc, template) => {
      const category = template.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(template);
      return acc;
    }, {} as Record<string, TemplateConfig[]>);
  }
}
