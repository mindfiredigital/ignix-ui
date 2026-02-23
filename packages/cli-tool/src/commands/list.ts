import { Command } from 'commander';
import { RegistryService } from '../services/RegistryService';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { ThemeService } from '../services/ThemeService';
import path from 'path';

export const listCommand = new Command()
  .name('list')
  .option('-y, --yes', 'Skip prompts')
  .option('--json', 'Machine output')
  .option('--cwd <path>', 'Working directory', '.')
  .description(chalk.hex('#FF6B35')('List available components or themes from the registry.'))
  .argument('<namespace>', 'The type of asset to list (e.g., component, theme)')
  .action(async (namespace, opts) => {
    const ctx = {
      isYes: !!opts.yes,
      isJson: !!opts.json,
      cwd: path.resolve(opts.cwd || '.'),
    };

    const originalCwd = process.cwd();

    try {
      process.chdir(ctx.cwd);

      // 🔇 Silent mode for JSON
      if (ctx.isJson) {
        const silent = (): void => {
          return;
        };
        logger.info = silent;
        logger.warn = silent;
        logger.error = silent;
        logger.success = silent;
      }

      const registryService = new RegistryService();
      const themeService = new ThemeService();

      if (ctx.isJson) {
        registryService.setSilent(true);
        themeService.setSilent?.(true);
      }

      switch (namespace) {
        case 'component':
        case 'components': {
          const components = await registryService.getAvailableComponents();

          const sorted = components
            .map((c) => c.name.toLowerCase())
            .sort((a, b) => a.localeCompare(b));

          if (ctx.isJson) {
            process.stdout.write(
              JSON.stringify(
                {
                  success: true,
                  components: sorted,
                },
                null,
                2
              )
            );
            return;
          }

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

          const sorted = themes.map((t) => t.id.toLowerCase()).sort((a, b) => a.localeCompare(b));

          if (ctx.isJson) {
            process.stdout.write(
              JSON.stringify(
                {
                  success: true,
                  themes: sorted,
                },
                null,
                2
              )
            );
            return;
          }

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

        case 'template':
        case 'templates': {
          const templates = await registryService.getAvailableTemplates();

          const sorted = templates
            .filter((t) => t.id)
            .map((t) => t.id!.toLowerCase())
            .sort((a, b) => a.localeCompare(b));

          if (ctx.isJson) {
            process.stdout.write(
              JSON.stringify(
                {
                  success: true,
                  templates: sorted,
                },
                null,
                2
              )
            );
            return;
          }

          if (templates.length > 0) {
            logger.info(chalk.bold('Available Templates:'));
            templates.forEach((template) => {
              console.log(
                `- ${chalk.cyan(template.name)} (${template.id}): ${template.description}`
              );
            });
          } else {
            logger.warn('No templates found in the registry.');
          }

          break;
        }

        default:
          if (ctx.isJson) {
            process.stdout.write(
              JSON.stringify(
                {
                  success: false,
                  error: `Unknown namespace: '${namespace}'`,
                },
                null,
                2
              )
            );
            process.exit(1);
          }

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
        process.exit(1);
      }

      logger.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    } finally {
      process.chdir(originalCwd);
    }
  });
