import { Command } from 'commander';
import { RegistryService } from '../services/RegistryService';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { ThemeService } from '../services/ThemeService';

export const listCommand = new Command()
  .name('list')
  .description(chalk.hex('#FF6B35')('List available components or themes from the registry.'))
  .argument('<namespace>', 'The type of asset to list (e.g., component, theme)')
  .action(async (namespace) => {
    const registryService = new RegistryService();
    const themeService = new ThemeService();

    switch (namespace) {
      case 'component':
      case 'components': {
        const components = await registryService.getAvailableComponents();
        if (components.length > 0) {
          logger.info(chalk.bold('Available Components:'));
          components.forEach((comp) => {
            console.log(`- ${chalk.cyan(comp.name)}: ${comp.description}`);
          });
        } else {
          logger.warn('No components found in the registry.');
        }
        break;
      }

      case 'theme':
      case 'themes': {
        const themes = await themeService.getAvailableThemes();
        if (themes.length > 0) {
          logger.info(chalk.bold('Available Themes:'));
          themes.forEach((theme) => {
            console.log(`- ${chalk.cyan(theme.name)} (${theme.id}): ${theme.description}`);
          });
        } else {
          logger.warn('No themes found in the registry.');
        }
        break;
      }

      default:
        logger.error(`Unknown namespace: '${namespace}'. Please use 'component' or 'theme'.`);
        process.exit(1);
    }
  });
