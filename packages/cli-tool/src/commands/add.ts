import { Command } from 'commander';
import prompts from 'prompts';
import { ComponentService } from '../services/ComponentService';
import { RegistryService } from '../services/RegistryService';
import { logger } from '../utils/logger';
import chalk from 'chalk';
import { ThemeService } from '../services/ThemeService';

export const addCommand = new Command()
  .name('add')
  .description(chalk.hex('#FF8C00')('Add components, or tokens to your project.'))
  .argument('<namespace>', chalk.green('The type of asset to add (e.g., component, theme)'))
  .argument('[identifiers...]', 'The names/IDs of the assets to add')
  .action(async (namespace, identifiers) => {
    const registryService = new RegistryService();

    switch (namespace) {
      case 'component':
      case 'components': {
        const componentService = new ComponentService();
        logger.info('Adding components...');
        const availableComponents = await registryService.getAvailableComponents();
        const componentNames = availableComponents.map((c) => c.name.toLowerCase());

        if (identifiers.length === 0) {
          const response = await prompts({
            type: 'multiselect',
            name: 'components',
            message: chalk.green('Select components to add:'),
            choices: availableComponents.map((c) => ({
              title: c.name,
              value: c.name.toLowerCase(),
            })),
          });
          identifiers = response.components || [];
        }

        if (!identifiers || identifiers.length === 0) {
          logger.warn('No components selected. Exiting.');
          return;
        }

        for (const id of identifiers) {
          if (componentNames.includes(id.toLowerCase())) {
            await componentService.install(id.toLowerCase());
          } else {
            logger.error(`Component '${id}' not found in the registry.`);
          }
        }
        break;
      }

      case 'theme':
      case 'themes': {
        const themeService = new ThemeService();
        const availableThemes = await themeService.getAvailableThemes();
        const themeIds = availableThemes.map((t) => t.id.toLowerCase());

        if (identifiers.length === 0) {
          const response = await prompts({
            type: 'multiselect',
            name: 'themes',
            message: chalk.green('Select themes to install:'),
            choices: availableThemes.map((t) => ({
              title: t.name,
              value: t.id.toLowerCase(),
            })),
          });
          identifiers = response.themes || [];
        }

        if (!identifiers || identifiers.length === 0) {
          logger.warn('No themes selected. Exiting.');
          return;
        }

        for (const id of identifiers) {
          if (themeIds.includes(id.toLowerCase())) {
            await themeService.install(id.toLowerCase());
          } else {
            logger.error(`Theme '${id}' not found in the registry.`);
          }
        }
        break;
      }

      default:
        logger.error(`Unknown namespace: '${namespace}'. Please use 'component' or 'theme'.`);
        process.exit(1);
    }
  });
