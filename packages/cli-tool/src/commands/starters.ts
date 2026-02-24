import { Command } from 'commander';
import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { getPackageManager } from '../utils/getPackageManager';
import {
  validateEmptyDirectory,
  createNextAppPackageJson,
  createNextAppTsconfig,
  createNextConfig,
  createTailwindConfig,
  createPostCSSConfig,
  createESLintConfig,
  createPrettierConfig,
  createAppDirectory,
  createSrcDirectory,
  createGlobalStyles,
  createIgnixConfig,
  createGitignore,
  createReadme,
} from '../services/starter-template/NextJsAppStarter';
import {
  ensureRootFiles,
  ensureRootTsconfig,
  ensureTsconfigPackage,
  scaffoldComponentsPackage,
  scaffoldConfigPackage,
  scaffoldNextApp,
} from '../services/starter-template/MonorepoStarter';
import {
  validateEmptyDirectory as validateEmptyDirectoryVite,
  createViteReactPackageJson,
  createViteReactTsconfig,
  createViteConfig,
  createTailwindConfig as createTailwindConfigVite,
  createPostCSSConfig as createPostCSSConfigVite,
  createESLintConfig as createESLintConfigVite,
  createPrettierConfig as createPrettierConfigVite,
  createIndexHtml,
  createSrcDirectory as createSrcDirectoryVite,
  createGlobalStyles as createGlobalStylesVite,
  createIgnixConfig as createIgnixConfigVite,
  createGitignore as createGitignoreVite,
  createViteEnvTypes,
} from '../services/starter-template/ViteReactStarter';

const execa = async (...args: any[]): Promise<any> => {
  const { execa: execaImport } = await import('execa');
  // Cast to any to allow forwarding arbitrary args without tuple typing errors
  return (execaImport as any)(...args);
};

export const startersCommandMonorepo = new Command()
  .name('monorepo-starters')
  .description(chalk.hex('#33A06F')('Starter generators for monorepo.'))
  .command('monorepo')
  .option('-y, --yes', 'Skip prompts')
  .option('--json', 'Machine output')
  .option('--cwd <path>', 'Working directory', '.')
  .description('Scaffold a Turborepo + pnpm workspaces monorepo')
  .action(async (opts) => {
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

      const noop = () => {
        return;
      };
      const spinner = ctx.isJson
        ? { start: noop, succeed: noop, fail: noop, text: '' }
        : ora('Scaffolding monorepo...').start();

      const root = process.cwd();

      await ensureRootFiles(root);
      await ensureRootTsconfig(root);
      await scaffoldConfigPackage(root);
      await scaffoldComponentsPackage(root);
      await ensureTsconfigPackage(root);
      await scaffoldNextApp(root);

      await execa('pnpm', ['install'], { cwd: root, stdio: ctx.isJson ? 'ignore' : 'inherit' });

      spinner.succeed('Monorepo scaffolded successfully.');

      if (ctx.isJson) {
        process.stdout.write(JSON.stringify({ success: true }, null, 2));
      }
    } catch (e) {
      if (ctx.isJson) {
        process.stdout.write(
          JSON.stringify(
            {
              success: false,
              error: e instanceof Error ? e.message : 'Unknown error',
            },
            null,
            2
          )
        );
      } else {
        logger.error(e instanceof Error ? e.message : String(e));
      }
      process.exit(1);
    } finally {
      process.chdir(originalCwd);
    }
  });

export const startersCommandNextjsApp = new Command()
  .name('nextjs-starters')
  .description(chalk.hex('#33A06F')('Starter generators for nextjs-app.'))
  .command('nextjs-app')
  .option('-y, --yes')
  .option('--json')
  .option('--cwd <path>', '.')
  .description(
    'Scaffold a blank Next.js 14+ app with App Router, TypeScript, Tailwind CSS, and Ignix UI'
  )
  .action(async (opts) => {
    const ctx = {
      isYes: !!opts?.yes,
      isJson: !!opts?.json,
      cwd: path.resolve(opts?.cwd || '.'),
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

      // 🔽 existing logic continues here
      // const spinner = ora('Scaffolding Next.js app...').start();
      const noop = () => {
        return;
      };
      const spinner = ctx.isJson
        ? { start: noop, succeed: noop, fail: noop, text: '' }
        : ora('Scaffolding Next.js app...').start();
      // try {
      const root = process.cwd();

      // 1. Validate that we're in an empty directory or prompt
      await validateEmptyDirectory(root);

      // 2. Create package.json
      await createNextAppPackageJson(root);

      // 3. Create TypeScript configuration
      await createNextAppTsconfig(root);

      // 4. Create Next.js configuration
      await createNextConfig(root);

      // 5. Create Tailwind CSS configuration with Ignix plugin
      await createTailwindConfig(root);

      // 6. Create PostCSS configuration
      await createPostCSSConfig(root);

      // 7. Create ESLint configuration
      await createESLintConfig(root);

      // 8. Create Prettier configuration
      await createPrettierConfig(root);

      // 9. Create app directory structure with layout and page
      await createAppDirectory(root);

      // 10. Create src directory structure
      await createSrcDirectory(root);

      // 11. Create global styles
      await createGlobalStyles(root);

      // 12. Create Ignix config
      await createIgnixConfig(root);

      // 13. Create .gitignore
      await createGitignore(root);

      // 14. Create README.md
      await createReadme(root);

      // 15. Initialize Git repository
      spinner.text = 'Initializing Git repository...';
      await execa('git', ['init'], { cwd: root, stdio: ctx.isJson ? 'ignore' : 'inherit' }).catch(
        () => {
          logger.warn('Git initialization failed, but continuing...');
        }
      );

      // 16. Install dependencies
      spinner.text = 'Installing dependencies...';
      const packageManager = await getPackageManager();
      await execa(packageManager, ['install'], {
        cwd: root,
        stdio: ctx.isJson ? 'ignore' : 'inherit',
      });

      spinner.succeed(chalk.green('Next.js app scaffolded successfully!'));
      if (ctx.isJson) {
        process.stdout.write(JSON.stringify({ success: true }, null, 2));
      }

      if (!ctx.isJson) {
        logger.info('\nNext steps:');
        logger.info(`1. Start dev server: ${chalk.cyan(`${packageManager} run dev`)}`);
        logger.info(`2. Open ${chalk.cyan('http://localhost:3000')} in your browser`);
        logger.info(`3. Add components: ${chalk.cyan('npx ignix add <component-name>')}`);
      }
      // logger.info('\nNext steps:');
      // logger.info(`1. Start dev server: ${chalk.cyan(`${packageManager} run dev`)}`);
      // logger.info(`2. Open ${chalk.cyan('http://localhost:3000')} in your browser`);
      // logger.info(`3. Add components: ${chalk.cyan('npx ignix add <component-name>')}`);
      // }
      // catch (e) {
      //   spinner.fail('Failed to scaffold Next.js app');
      //   if (e instanceof Error) logger.error(e.message);
      //   process.exit(1);
      // }
    } catch (e) {
      if (ctx.isJson) {
        process.stdout.write(
          JSON.stringify(
            {
              success: false,
              error: e instanceof Error ? e.message : 'Unknown error',
            },
            null,
            2
          )
        );
      } else {
        logger.error(e instanceof Error ? e.message : String(e));
      }
      process.exit(1);
    } finally {
      process.chdir(originalCwd);
    }
  });

export const startersCommandViteReact = new Command()
  .name('vite-react-starters')
  .description(chalk.hex('#33A06F')('Starter generators for vite-react.'))
  .command('vite-react')
  .option('-y, --yes')
  .option('--json')
  .option('--cwd <path>', '.')
  .description('Scaffold a blank Vite + React app with TypeScript, Tailwind CSS, and Ignix UI')
  .action(async (opts) => {
    const ctx = {
      isYes: !!opts?.yes,
      isJson: !!opts?.json,
      cwd: path.resolve(opts?.cwd || '.'),
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

      // 🔽 existing logic continues here

      // const spinner = ora('Scaffolding Vite + React app...').start();
      const noop = () => {
        return;
      };
      const spinner = ctx.isJson
        ? { start: noop, succeed: noop, fail: noop, text: '' }
        : ora('Scaffolding Vite + React app...').start();

      // try {
      const root = process.cwd();

      // 1. Validate that we're in an empty directory or prompt
      await validateEmptyDirectoryVite(root);

      // 2. Create package.json
      await createViteReactPackageJson(root);

      // 3. Create TypeScript configuration
      await createViteReactTsconfig(root);

      // 4. Create Vite configuration
      await createViteConfig(root);

      // 5. Create Tailwind CSS configuration with Ignix plugin
      await createTailwindConfigVite(root);

      // 6. Create PostCSS configuration
      await createPostCSSConfigVite(root);

      // 7. Create ESLint configuration
      await createESLintConfigVite(root);

      // 8. Create Prettier configuration
      await createPrettierConfigVite(root);

      // 9. Create index.html
      await createIndexHtml(root);

      // 10. Create src directory structure
      await createSrcDirectoryVite(root);

      // 11. Create global styles
      await createGlobalStylesVite(root);

      // 12. Create Ignix config
      await createIgnixConfigVite(root);

      // 13. Create .gitignore
      await createGitignoreVite(root);

      // 14. Create vite-env.d.ts
      await createViteEnvTypes(root);

      // 16. Initialize Git repository
      spinner.text = 'Initializing Git repository...';
      await execa('git', ['init'], { cwd: root, stdio: ctx.isJson ? 'ignore' : 'inherit' }).catch(
        () => {
          logger.warn('Git initialization failed, but continuing...');
        }
      );

      // 17. Install dependencies
      spinner.text = 'Installing dependencies...';
      const packageManager = await getPackageManager();
      await execa(packageManager, ['install'], {
        cwd: root,
        stdio: ctx.isJson ? 'ignore' : 'inherit',
      });

      spinner.succeed(chalk.green('Vite + React app scaffolded successfully!'));
      if (ctx.isJson) {
        process.stdout.write(JSON.stringify({ success: true }, null, 2));
      }

      if (!ctx.isJson) {
        logger.info('\nNext steps:');
        logger.info(`1. Start dev server: ${chalk.cyan(`${packageManager} run dev`)}`);
        logger.info(`2. Open ${chalk.cyan('http://localhost:5173')} in your browser`);
        logger.info(`3. Add components: ${chalk.cyan('npx ignix add <component-name>')}`);
      }
      // logger.info('\nNext steps:');
      // logger.info(`1. Start dev server: ${chalk.cyan(`${packageManager} run dev`)}`);
      // logger.info(`2. Open ${chalk.cyan('http://localhost:5173')} in your browser`);
      // logger.info(`3. Add components: ${chalk.cyan('npx ignix add <component-name>')}`);

      // } catch (e) {
      //   spinner.fail('Failed to scaffold Vite + React app');
      //   if (e instanceof Error) logger.error(e.message);
      //   process.exit(1);
      // }
    } catch (e) {
      if (ctx.isJson) {
        process.stdout.write(
          JSON.stringify(
            {
              success: false,
              error: e instanceof Error ? e.message : 'Unknown error',
            },
            null,
            2
          )
        );
      } else {
        logger.error(e instanceof Error ? e.message : String(e));
      }
      process.exit(1);
    } finally {
      process.chdir(originalCwd);
    }
  });
