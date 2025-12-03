import { Command } from 'commander';
import prompts from 'prompts';
import { ComponentService } from '../services/ComponentService';
import { RegistryService } from '../services/RegistryService';
import { logger } from '../utils/logger';
import chalk from 'chalk';
import { ThemeService } from '../services/ThemeService';
import { TemplateService } from '../services/TemplateService';

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
        const templateService = new TemplateService();
        logger.info('Adding components...');
        const availableComponents = await registryService.getAvailableComponents();

        type SelectedComponent = {
          name: string;
          type: string;
        };

        let selectedItems: SelectedComponent[] = [];

        if (identifiers.length === 0) {
          const installResponse = await prompts({
            type: 'select',
            name: 'component',
            message: chalk.green('Select a component to add:'),
            choices: availableComponents.map((c) => ({
              title: c.name,
              value: {
                name: c.name.toLowerCase(),
                type: c.files.main.type,
              },
            })),
          });

          if (installResponse.component) {
            selectedItems = [installResponse.component];
          }
        } else {
          // If identifiers were passed directly from CLI args
          const normalized = identifiers.map((i: string) => i.toLowerCase());
          selectedItems = availableComponents
            .filter((c) => {
              const name = c.name?.toLowerCase();
              const id = c.id?.toLowerCase();
              return normalized.includes(name) || normalized.includes(id);
            })
            .map((c) => ({
              name: (c.id || c.name).toLowerCase(),
              type: c.files.main.type,
            }));
        }
        if (!selectedItems || selectedItems.length === 0) {
          logger.warn('No component selected. Exiting.');
          return;
        }

        for (const item of selectedItems) {
          console.log('Installing:', item.name, 'Type:', item.type);

          if (item.type === 'component') {
            await componentService.install(item.name);
          } else if (item.type === 'template') {
            await templateService.install(item.name);
          } else {
            logger.error(`Unknown type '${item.type}' for '${item.name}'`);
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
      case 'template':
      case 'templates': {
        const registryService = new RegistryService();
        const templateService = new TemplateService();

        logger.info('Adding components...');
        const availabletemplates = await registryService.getAvailableTemplates();
        const componentNames = availabletemplates.map((c) => c.id);

        if (identifiers.length === 0) {
          const installResponse = await prompts({
            type: 'select',
            name: 'template',
            message: chalk.green('Select a template to add:'),
            choices: availabletemplates.map((c) => ({
              title: c.name,
              value: c.id,
            })),
          });
          // Convert the single selected component to an array
          identifiers = installResponse.template ? [installResponse.template] : [];
        }

        if (!identifiers || identifiers.length === 0) {
          logger.warn('No template selected. Exiting.');
          return;
        }

        for (const id of identifiers) {
          if (componentNames.includes(id.toLowerCase())) {
            await templateService.install(id.toLowerCase());
          } else {
            logger.error(`Component '${id}' not found in the registry.`);
          }
        }
        break;
      }

      case 'template':
      case 'templates': {
        const templateService = new TemplateService();
        const availableTemplates = await templateService.getAvailableTemplates();
        const templateIds = availableTemplates.map((t) => t.id.toLowerCase());

        if (identifiers.length === 0) {
          const response = await prompts({
            type: 'multiselect',
            name: 'templates',
            message: chalk.green('Select templates to install:'),
            choices: availableTemplates.map((t) => ({
              title: `${t.name} - ${t.description}`,
              value: t.id.toLowerCase(),
              description: t.category ? `Category: ${t.category}` : undefined,
            })),
          });
          identifiers = response.templates || [];
        }

        if (!identifiers || identifiers.length === 0) {
          logger.warn('No templates selected. Exiting.');
          return;
        }

        for (const id of identifiers) {
          if (templateIds.includes(id.toLowerCase())) {
            await templateService.install(id.toLowerCase());
          } else {
            logger.error(`Template '${id}' not found in the registry.`);
          }
        }
        break;
      }

      default:
        logger.error(`Unknown namespace: '${namespace}'. Please use 'component' or 'theme'.`);
        process.exit(1);
    }
  });
