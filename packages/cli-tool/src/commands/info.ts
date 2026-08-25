// packages/cli-tool/src/commands/info.ts
import { Command } from 'commander';
import { RegistryService } from '../services/RegistryService';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import path from 'path';

export function createInfoCommand() {
  return new Command()
    .name('info')
    .description(chalk.hex('#FF8C00')('Get detailed information about a component'))
    .argument('<name>', 'Component name')
    .option('--json', 'Machine output')
    .option('--cwd <path>', 'Working directory', '.')
    .action(async (name, opts) => {
      const ctx = {
        isJson: !!opts.json,
        cwd: path.resolve(opts.cwd || '.'),
      };

      const originalCwd = process.cwd();

      try {
        process.chdir(ctx.cwd);

        if (ctx.isJson) {
          logger.setSilent(true);
        }

        const registryService = new RegistryService();
        if (ctx.isJson) {
          registryService.setSilent(true);
        }

        const components = await registryService.getAvailableComponents();
        const component = components.find(
          (c) =>
            c.name.toLowerCase() === name.toLowerCase() ||
            c.id?.toLowerCase() === name.toLowerCase()
        );

        if (!component) {
          if (ctx.isJson) {
            console.log(
              JSON.stringify(
                {
                  success: false,
                  error: `Component "${name}" not found`,
                },
                null,
                2
              )
            );
            process.exitCode = 1;
          } else {
            logger.error(`Component "${name}" not found`);
            process.exitCode = 1;
          }
          process.chdir(originalCwd);
          return;
        }

        if (ctx.isJson) {
          console.log(
            JSON.stringify(
              {
                success: true,
                component,
              },
              null,
              2
            )
          );
        } else {
          console.log(chalk.bold(`\n📦 ${component.name}\n`));
          console.log(chalk.gray(`ID: ${component.id || component.name}`));
          console.log(chalk.gray(`Description: ${component.description}`));
          if (component.files) {
            console.log(chalk.bold('\nFiles:'));
            Object.entries(component.files).forEach(([key, file]) => {
              console.log(`  - ${key}: ${file.path}`);
            });
          }
          if (component.dependencies) {
            console.log(chalk.bold('\nDependencies:'));
            component.dependencies.forEach((dep) => {
              console.log(`  - ${dep}`);
            });
          }
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
          process.exitCode = 1;
        }
        logger.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
      } finally {
        if (ctx.isJson) {
          logger.setSilent(false);
        }
        process.chdir(originalCwd);
      }
    });
}

export const infoCommand = createInfoCommand();
