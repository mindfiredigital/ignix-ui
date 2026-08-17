import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import semver from 'semver';
import { logger } from '../utils/logger';
import chalk from 'chalk';

export function createDoctorCommand() {
  return new Command()
    .name('doctor')
    .description(chalk.hex('#FF8C00')('Check Ignix UI compatibility with your project'))
    .option('--json', 'Machine output')
    .option('--cwd <path>', 'Working directory', '.')
    .action(async (opts) => {
      const ctx = {
        isJson: !!opts.json,
        cwd: path.resolve(opts.cwd || '.'),
      };

      const checks = {
        nodeVersion: false,
        reactVersion: false,
        tailwind: false,
        typescript: false,
        config: false,
      };

      const originalCwd = process.cwd();
      try {
        process.chdir(ctx.cwd);

        if (ctx.isJson) {
          logger.setSilent(true);
        }

        // Check Node version
        const nodeVersion = process.version;
        checks.nodeVersion = semver.gte(nodeVersion, '16.14.0');

        // Check package.json
        const packageJson = await fs.readJson('package.json').catch(() => null);

        const satisfiesMinVersion = (versionRange: string | undefined, minimum: string) => {
          if (!versionRange) return false;
          const minVersion = semver.minVersion(versionRange);
          return minVersion ? semver.gte(minVersion, minimum) : false;
        };
        if (packageJson) {
          // Check React
          const reactVersion =
            packageJson.dependencies?.react || packageJson.devDependencies?.react;
          checks.reactVersion = satisfiesMinVersion(reactVersion, '17.0.0');

          // Check TypeScript
          const tsVersion = packageJson.devDependencies?.typescript;
          checks.typescript = satisfiesMinVersion(tsVersion, '4.5.0');

          // Check Tailwind
          const tailwindVersion = packageJson.devDependencies?.tailwindcss;
          checks.tailwind = !!tailwindVersion;
        }

        // Check config file
        checks.config = await fs.pathExists('ignix.config.js');

        if (ctx.isJson) {
          console.log(
            JSON.stringify(
              {
                success: true,
                checks,
                compatible: Object.values(checks).every(Boolean),
              },
              null,
              2
            )
          );
        } else {
          console.log(chalk.bold('\n🔍 Ignix UI Compatibility Check\n'));

          console.log(
            `${checks.nodeVersion ? '✅' : '❌'} Node.js: ${process.version} (requires 16.14+)`
          );
          console.log(
            `${checks.reactVersion ? '✅' : '❌'} React: ${
              checks.reactVersion ? '✓' : 'Required 17+'
            }`
          );
          console.log(
            `${checks.tailwind ? '✅' : '❌'} Tailwind CSS: ${checks.tailwind ? '✓' : 'Required'}`
          );
          console.log(
            `${checks.typescript ? '✅' : '❌'} TypeScript: ${
              checks.typescript ? '✓' : 'Optional but recommended'
            }`
          );
          console.log(
            `${checks.config ? '✅' : '❌'} ignix.config.js: ${
              checks.config ? '✓' : 'Run ignix init'
            }`
          );

          const compatible = Object.values(checks).every(Boolean);
          console.log(
            chalk.bold(
              `\n${compatible ? '✅ Your project is compatible!' : '❌ Some issues need attention'}`
            )
          );
        }
      } catch (error) {
        if (ctx.isJson) {
          console.log(
            JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
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

export const doctorCommand = createDoctorCommand();
