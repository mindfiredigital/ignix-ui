import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import { ThemeService } from '../services/ThemeService';
import { logger } from '../utils/logger';

async function showThemeMenu(): Promise<void> {
  const spinner = ora();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await prompts({
      type: 'select',
      name: 'action',
      message: 'What would you like to do with themes?',
      choices: [
        { title: 'List available themes', value: 'list' },
        { title: 'Install a theme preset', value: 'install' },
        { title: 'View theme info', value: 'info' },
        { title: 'Exit', value: 'exit' },
      ],
    });

    if (!response.action || response.action === 'exit') {
      logger.info('Exiting theme manager.');
      break;
    }

    try {
      const themeService = new ThemeService();

      switch (response.action) {
        case 'list': {
          spinner.start('Fetching available themes...');
          const themes = await themeService.getAvailableThemes();
          spinner.stop();

          if (themes.length === 0) {
            logger.warn('No themes available.');
          } else {
            console.log(chalk.bold('\nAvailable Themes:\n'));
            themes.forEach((theme) => {
              console.log(chalk.cyan(`  • ${theme.name}`) + chalk.gray(` (${theme.id})`));
              console.log(chalk.gray(`    ${theme.description}\n`));
            });
          }
          break;
        }

        case 'install': {
          spinner.start('Fetching available themes...');
          const themes = await themeService.getAvailableThemes();
          spinner.stop();

          if (themes.length === 0) {
            logger.warn('No themes available to install.');
            break;
          }

          const installResponse = await prompts({
            type: 'select',
            name: 'themeId',
            message: 'Select a theme to install:',
            choices: themes.map((t) => ({ title: t.name, value: t.id })),
          });

          if (installResponse.themeId) {
            await themeService.install(installResponse.themeId);
          }
          break;
        }

        case 'info': {
          spinner.start('Fetching available themes...');
          const themes = await themeService.getAvailableThemes();
          spinner.stop();

          if (themes.length === 0) {
            logger.warn('No themes available.');
            break;
          }

          const infoResponse = await prompts({
            type: 'select',
            name: 'themeId',
            message: 'Select a theme to view details:',
            choices: themes.map((t) => ({ title: t.name, value: t.id })),
          });

          if (infoResponse.themeId) {
            const theme = await themeService.getThemeConfig(infoResponse.themeId);
            if (theme) {
              console.log(chalk.bold(`\n${theme.name}`));
              console.log(chalk.gray(`ID: ${theme.id}`));
              console.log(chalk.gray(`Description: ${theme.description}`));
              console.log(chalk.bold('\nTheme Configuration:'));
              console.log(JSON.stringify(theme.theme, null, 2));
            }
          }
          break;
        }
      }
    } catch (error) {
      spinner.fail('An error occurred');
      if (error instanceof Error) {
        logger.error(error.message);
      }
    }

    console.log(''); // Add spacing before next menu
  }
}

export const themesCommand = new Command()
  .name('themes')
  .description(chalk.hex('#FF7F50')('Manage, export, and validate themes.'))
  .action(async () => {
    await showThemeMenu();
  });
