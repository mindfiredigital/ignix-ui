import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { loadConfig } from '../utils/config';
import axios from 'axios';

interface ThemePresetConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: object;
}
export class ThemeService {
  private themes: Record<string, ThemePresetConfig> | null = null;

  private async fetchThemes(): Promise<Record<string, ThemePresetConfig>> {
    if (this.themes) {
      return this.themes;
    }

    const config = await loadConfig();
    const spinner = ora('Fetching themes...').start();

    try {
      const response = await axios.get<Record<string, ThemePresetConfig>>(config.themeUrl);
      spinner.succeed('Themes fetched successfully');
      this.themes = response.data;
      return this.themes;
    } catch (error) {
      spinner.fail('Failed to fetch themes');
      logger.error('Could not connect to the theme registry. Please check your connection.');
      process.exit(1);
    }
  }

  public async getThemeConfig(id: string): Promise<ThemePresetConfig | undefined> {
    const themes = await this.fetchThemes();
    const themeData: any = themes[id];

    if (!themeData) {
      return undefined;
    }

    return {
      category: themeData.category,
      id: themeData.id,
      name: themeData.name,
      description: themeData.description,
      theme: themeData,
    };
  }

  public async getAvailableThemes(): Promise<ThemePresetConfig[]> {
    const themes = await this.fetchThemes();
    return Object.values(themes);
  }

  /**
   * Fetches a theme preset from the theme registry and writes it to a file.
   */
  public async install(id: string): Promise<void> {
    const spinner = ora(`Installing theme preset: ${id}...`).start();
    try {
      const config = await loadConfig();
      const themeConfig = await this.getThemeConfig(id);

      if (!themeConfig) {
        throw new Error(`Theme preset '${id}' not found in the registry.`);
      }

      const destDir = path.resolve(config.themesDir);
      await fs.ensureDir(destDir);

      const destFile = path.join(destDir, `${id}.ts`);

      // Convert theme ID to camelCase for variable name (e.g., "the-neon" -> "theNeon")
      const variableName = themeConfig.id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

      const fileContent = `import type { ThemeConfig } from '@mindfiredigital/ignix-ui';

export const ${variableName}Theme: ThemeConfig = ${JSON.stringify(themeConfig.theme, null, 2)};
`;

      await fs.writeFile(destFile, fileContent);

      spinner.succeed(chalk.green(`Successfully installed theme: ${chalk.cyan(themeConfig.name)}`));
      logger.info(`Preset file created at: ${chalk.yellow(destFile)}`);
      logger.info(`You can now import it and pass to your <ThemeProvider>.`);
    } catch (error) {
      spinner.fail(`Failed to install theme preset: ${id}.`);
      if (error instanceof Error) {
        logger.error(error.message);
      }
    }
  }
}
