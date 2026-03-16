// packages/cli-tool/src/commands/list.ts
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
  .option('--search <query>', 'Search components by keyword')
  .option(
    '--category <category>',
    'Filter by category (layout, forms, feedback, navigation, data-display)'
  )
  .description(chalk.hex('#FF6B35')('List available components or themes from the registry.'))
  .argument('<namespace>', 'The type of asset to list (e.g., component, theme)')
  .action(async (namespace, opts) => {
    const ctx = {
      isYes: !!opts.yes,
      isJson: !!opts.json,
      cwd: path.resolve(opts.cwd || '.'),
      search: opts.search,
      category: opts.category,
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
          let components = await registryService.getAvailableComponents();

          // Apply search filter if provided
          if (ctx.search) {
            const searchTerm = ctx.search.toLowerCase();
            components = components.filter(
              (c) =>
                c.name.toLowerCase().includes(searchTerm) ||
                (c.description && c.description.toLowerCase().includes(searchTerm))
            );
          }

          // Apply category filter if provided
          if (ctx.category) {
            const category = ctx.category.toLowerCase();
            components = components.filter((c) => c.category?.toLowerCase() === category);
          }

          // Sort components alphabetically
          const sorted = components
            .map((c) => ({
              name: c.name,
              description: c.description,
              category: c.category,
              id: c.id,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          if (ctx.isJson) {
            console.log(
              JSON.stringify(
                {
                  success: true,
                  components: sorted,
                  total: sorted.length,
                  searchQuery: ctx.search || null,
                  category: ctx.category || null,
                },
                null,
                2
              )
            );
            return;
          }

          if (sorted.length > 0) {
            if (ctx.search) {
              logger.info(chalk.bold(`\n🔍 Search results for "${ctx.search}":`));
            } else if (ctx.category) {
              logger.info(chalk.bold(`\n📂 ${ctx.category} components:`));
            } else {
              logger.info(chalk.bold('\n📦 Available Components:'));
            }

            sorted.forEach((comp) => {
              const category = comp.category ? chalk.gray(` [${comp.category}]`) : '';
              console.log(`  ${chalk.cyan('•')} ${chalk.cyan(comp.name)}${category}`);
              if (comp.description) {
                console.log(`    ${chalk.gray(comp.description)}`);
              }
            });
            console.log(chalk.gray(`\nTotal: ${sorted.length} components`));
          } else {
            if (ctx.search) {
              logger.warn(`No components found matching "${ctx.search}"`);
            } else if (ctx.category) {
              logger.warn(`No components found in category "${ctx.category}"`);
            } else {
              logger.warn('No components found in the registry.');
            }
          }

          break;
        }

        case 'theme':
        case 'themes': {
          const themes = await themeService.getAvailableThemes();

          // Sort themes alphabetically
          const sorted = themes
            .map((t) => ({
              id: t.id,
              name: t.name,
              description: t.description,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          if (ctx.isJson) {
            console.log(
              JSON.stringify(
                {
                  success: true,
                  themes: sorted,
                  total: sorted.length,
                },
                null,
                2
              )
            );
            return;
          }

          if (sorted.length > 0) {
            logger.info(chalk.bold('\n🎨 Available Themes:'));
            sorted.forEach((theme) => {
              console.log(`  ${chalk.cyan('•')} ${chalk.cyan(theme.name)} (${theme.id})`);
              if (theme.description) {
                console.log(`    ${chalk.gray(theme.description)}`);
              }
            });
            console.log(chalk.gray(`\nTotal: ${sorted.length} themes`));
          } else {
            logger.warn('No themes found in the registry.');
          }

          break;
        }

        case 'template':
        case 'templates': {
          const templates = await registryService.getAvailableTemplates();

          // Sort templates alphabetically
          const sorted = templates
            .filter((t) => t.id)
            .map((t) => ({
              id: t.id,
              name: t.name,
              description: t.description,
            }))
            .sort((a, b) => a.name!.localeCompare(b.name!));

          if (ctx.isJson) {
            console.log(
              JSON.stringify(
                {
                  success: true,
                  templates: sorted,
                  total: sorted.length,
                },
                null,
                2
              )
            );
            return;
          }

          if (sorted.length > 0) {
            logger.info(chalk.bold('\n📋 Available Templates:'));
            sorted.forEach((template) => {
              console.log(`  ${chalk.cyan('•')} ${chalk.cyan(template.name)} (${template.id})`);
              if (template.description) {
                console.log(`    ${chalk.gray(template.description)}`);
              }
            });
            console.log(chalk.gray(`\nTotal: ${sorted.length} templates`));
          } else {
            logger.warn('No templates found in the registry.');
          }

          break;
        }

        default:
          if (ctx.isJson) {
            console.log(
              JSON.stringify(
                {
                  success: false,
                  error: `Unknown namespace: '${namespace}'. Please use 'component', 'theme', or 'template'.`,
                },
                null,
                2
              )
            );
            process.exit(1);
          }

          logger.error(
            `Unknown namespace: '${namespace}'. Please use 'component', 'theme', or 'template'.`
          );
          process.exit(1);
      }
    } catch (error) {
      if (ctx.isJson) {
        console.log(
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
