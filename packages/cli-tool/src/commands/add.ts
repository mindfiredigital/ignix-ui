import { Command } from 'commander';
import prompts from 'prompts';
import { ComponentService } from '../services/ComponentService';
import { RegistryService } from '../services/RegistryService';
import { logger } from '../utils/logger';
import chalk from 'chalk';
import { ThemeService } from '../services/ThemeService';
import { TemplateService } from '../services/TemplateService';
import path from 'path';

export const addCommand = new Command()
  .name('add')
  .option('-y, --yes', 'Skip prompts')
  .option('--json', 'Machine output')
  .option('--cwd <path>', 'Working directory', '.')
  .description(chalk.hex('#FF8C00')('Add components, or tokens to your project.'))
  .argument('<namespace>', chalk.green('The type of asset to add (e.g., component, theme)'))
  .argument('[identifiers...]', 'The names/IDs of the assets to add')
  .action(async (namespace, identifiers, opts) => {
    const ctx = {
      isYes: !!opts.yes,
      isJson: !!opts.json,
      cwd: path.resolve(opts.cwd || '.'),
    };

    const originalCwd = process.cwd();
    try {
      process.chdir(ctx.cwd);

      if (ctx.isJson) {
        const silent = (): void => {
          return;
        };
        logger.info = silent;
        logger.warn = silent;
        logger.error = silent;
        logger.success = silent;
      }

      const installed: string[] = [];
      const skipped: string[] = [];
      const registryService = new RegistryService();
      if (ctx.isJson) {
        registryService.setSilent(true);
      }

      switch (namespace) {
        case 'component':
        case 'components': {
          const dependencySet = new Set<string>();
          const componentService = new ComponentService();
          if (ctx.isJson) {
            componentService.setSilent(true);
          }
          const templateService = new TemplateService();
          logger.info('Adding components...');
          const availableComponents = await registryService.getAvailableComponents();

          type SelectedComponent = {
            name: string;
            type: string;
          };

          let selectedItems: SelectedComponent[] = [];

          if (identifiers.length === 0 && !ctx.isYes) {
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
            // const normalized = identifiers.map((i: string) => i.toLowerCase());
            // const foundNames = new Set<string>();
            // selectedItems = availableComponents
            //   .filter((c) => {
            //     const name = c.name?.toLowerCase();
            //     const id = c.id?.toLowerCase();
            //     const match = normalized.includes(name) || normalized.includes(id);
            //     if (match) {
            //       foundNames.add(name);
            //       if (id) foundNames.add(id);
            //     }
            //     return match;
            //   })
            //   .map((c) => ({
            //     name: (c.id || c.name).toLowerCase(),
            //     type: c.files.main.type,
            //   }));

            // Deterministic processing based on user input
            const normalized = identifiers.map((i: string) => i.toLowerCase());

            // Build lookup map
            const componentMap = new Map<string, any>();
            for (const c of availableComponents) {
              if (c.name) componentMap.set(c.name.toLowerCase(), c);
              if (c.id) componentMap.set(c.id.toLowerCase(), c);
            }

            selectedItems = [];

            for (const id of normalized) {
              const component = componentMap.get(id);

              if (!component) {
                skipped.push(id);
                continue;
              }

              selectedItems.push({
                name: (component.id || component.name).toLowerCase(),
                type: component.files.main.type,
              });
            }
          }
          if (!selectedItems || selectedItems.length === 0) {
            if (ctx.isJson) {
              process.stdout.write(
                JSON.stringify(
                  {
                    success: true,
                    requested: identifiers,
                    installed: [],
                    dependencies: Array.from(dependencySet),
                    skipped: identifiers || [],
                  },
                  null,
                  2
                )
              );
            } else {
              logger.warn('No component selected. Exiting.');
            }
            process.chdir(originalCwd);
            return;
          }

          for (const item of selectedItems) {
            if (!ctx.isJson) {
              console.log('Installing:', item.name, 'Type:', item.type);
            }

            if (item.type === 'component') {
              // await componentService.install(item.name);
              // installed.push(item.name);
              const deps = await componentService.install(item.name);

              installed.push(item.name);

              deps?.forEach((d) => {
                if (d !== item.name) dependencySet.add(d);
              });
            } else if (item.type === 'template') {
              await templateService.install(item.name);
              installed.push(item.name);
            } else {
              skipped.push(item.name);
              if (!ctx.isJson) {
                logger.error(`Unknown type '${item.type}' for '${item.name}'`);
              }
            }
          }

          if (ctx.isJson) {
            process.stdout.write(
              JSON.stringify(
                {
                  success: true,
                  requested: identifiers,
                  installed,
                  dependencies: Array.from(dependencySet),
                  skipped,
                },
                null,
                2
              )
            );
          }

          break;
        }

        case 'theme':
        case 'themes': {
          const themeService = new ThemeService();

          if (ctx.isJson) {
            themeService.setSilent(true);
          }

          const availableThemes = await themeService.getAvailableThemes();
          const themeMap = new Map<string, string>();

          for (const t of availableThemes) {
            themeMap.set(t.id.toLowerCase(), t.id.toLowerCase());
          }

          const installed: string[] = [];
          const skipped: string[] = [];

          // interactive only in human mode
          if (identifiers.length === 0 && !ctx.isYes) {
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

          // no selection
          if (!identifiers || identifiers.length === 0) {
            if (ctx.isJson) {
              process.stdout.write(
                JSON.stringify(
                  {
                    success: true,
                    requested: [],
                    installed: [],
                    skipped: [],
                  },
                  null,
                  2
                )
              );
              break;
            }

            logger.warn('No themes selected. Exiting.');
            break;
          }

          const normalized = identifiers.map((i: string) => i.toLowerCase());

          for (const id of normalized) {
            const match = themeMap.get(id);

            if (!match) {
              skipped.push(id);
              continue;
            }

            await themeService.install(match);
            installed.push(match);
          }

          // deterministic sort
          installed.sort((a, b) => a.localeCompare(b));
          skipped.sort((a, b) => a.localeCompare(b));

          if (ctx.isJson) {
            process.stdout.write(
              JSON.stringify(
                {
                  success: true,
                  requested: normalized,
                  installed,
                  skipped,
                },
                null,
                2
              )
            );
          }

          break;
        }

        case 'template':
        case 'templates': {
          const registryService = new RegistryService();
          const templateService = new TemplateService();

          if (ctx.isJson) {
            registryService.setSilent(true);
            templateService.setSilent?.(true);
          }

          const availableTemplates = await registryService.getAvailableTemplates();

          const templateMap = new Map<string, string>();
          // for (const t of availableTemplates) {
          //   templateMap.set(t.id.toLowerCase(), t.id.toLowerCase());
          // }
          for (const t of availableTemplates) {
            if (!t.id) continue;
            const id = t.id.toLowerCase();
            templateMap.set(id, id);
          }

          const installed: string[] = [];
          const skipped: string[] = [];

          // interactive only in human mode
          if (identifiers.length === 0 && !ctx.isYes) {
            const installResponse = await prompts({
              type: 'select',
              name: 'template',
              message: chalk.green('Select a template to add:'),
              // choices: availableTemplates.map((c) => ({
              //   title: c.name,
              //   value: c.id.toLowerCase(),
              // })),
              choices: availableTemplates
                .filter((c) => c.id)
                .map((c) => ({
                  title: c.name,
                  value: c.id!.toLowerCase(),
                })),
            });

            identifiers = installResponse.template ? [installResponse.template] : [];
          }

          // nothing selected
          if (!identifiers || identifiers.length === 0) {
            if (ctx.isJson) {
              process.stdout.write(
                JSON.stringify(
                  {
                    success: true,
                    requested: [],
                    installed: [],
                    skipped: [],
                  },
                  null,
                  2
                )
              );
              break;
            }

            logger.warn('No template selected. Exiting.');
            break;
          }

          const normalized = identifiers.map((i: string) => i.toLowerCase());

          for (const id of normalized) {
            const match = templateMap.get(id);

            if (!match) {
              skipped.push(id);
              continue;
            }

            await templateService.install(match);
            installed.push(match);
          }

          // deterministic sort
          installed.sort((a, b) => a.localeCompare(b));
          skipped.sort((a, b) => a.localeCompare(b));

          if (ctx.isJson) {
            process.stdout.write(
              JSON.stringify(
                {
                  success: true,
                  requested: normalized,
                  installed,
                  skipped,
                },
                null,
                2
              )
            );
          }

          break;
        }

        default:
          logger.error(`Unknown namespace: '${namespace}'. Please use 'component' or 'theme'.`);
          process.exit(1);
      }
    } catch (error) {
      if (ctx.isJson) {
        process.stdout.write(
          JSON.stringify(
            {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            null,
            2
          )
        );
      } else {
        logger.error(error instanceof Error ? error.message : String(error));
      }
      process.exit(1);
    } finally {
      process.chdir(originalCwd);
    }
  });
