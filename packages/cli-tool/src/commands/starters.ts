import { Command } from 'commander';
import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import { logger } from '../utils/logger';
import { getPackageManager } from '../utils/getPackageManager';
import { writeAgentsFile } from '../utils/agentsFile';
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
  createCnUtil as createCnUtilNextJs,
} from '../services/starter-template/NextJsAppStarter';
import {
  ensureRootFiles,
  ensureRootTsconfig,
  ensureTsconfigPackage,
  scaffoldUiPackage,
  scaffoldConfigPackage,
  scaffoldNextApp,
  createIgnixConfig as createIgnixConfigMonorepo,
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
  createCnUtil as createCnUtilVite,
} from '../services/starter-template/ViteReactStarter';

const execa = async (...args: any[]): Promise<any> => {
  const { execa: execaImport } = await import('execa');
  // Cast to any to allow forwarding arbitrary args without tuple typing errors
  return (execaImport as any)(...args);
};

export function createStartersCommandMonorepo() {
  return new Command()
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

      if (!ctx.isYes && !ctx.isJson) {
        const response = await prompts({
          type: 'confirm',
          name: 'value',
          message: `Scaffold a Turborepo + pnpm monorepo in ${chalk.cyan(ctx.cwd)}?`,
          initial: true,
        });

        if (!response.value) {
          logger.info('Aborted.');
          return;
        }
      }

      const originalCwd = process.cwd();
      let restoreLogger: (() => void) | undefined;

      try {
        process.chdir(ctx.cwd);

        if (ctx.isJson) {
          restoreLogger = logger.setSilent(true);
        }

        const noop = () => {
          return;
        };
        const spinner = ctx.isJson
          ? { start: noop, succeed: noop, fail: noop, stop: noop, text: '' }
          : ora('Scaffolding monorepo...').start();

        const root = process.cwd();

        await ensureRootFiles(root);
        await ensureRootTsconfig(root);
        await scaffoldConfigPackage(root);
        await scaffoldUiPackage(root);
        await ensureTsconfigPackage(root);
        await scaffoldNextApp(root);
        await createIgnixConfigMonorepo(root);
        await writeAgentsFile(root);

        if (!ctx.isJson) spinner.stop();
        await execa('pnpm', ['install'], { cwd: root, stdio: ctx.isJson ? 'ignore' : 'inherit' });
        if (!ctx.isJson) spinner.start('Finalizing monorepo...');

        spinner.succeed('Monorepo scaffolded successfully.');

        if (ctx.isJson) {
          console.log(JSON.stringify({ success: true }, null, 2));
        }
      } catch (e) {
        if (ctx.isJson) {
          console.log(
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
        process.exitCode = 1;
      } finally {
        restoreLogger?.();
        process.chdir(originalCwd);
      }
    });
}

export const startersCommandMonorepo = createStartersCommandMonorepo();

export function createStartersCommandNextjsApp() {
  return new Command()
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

      if (!ctx.isYes && !ctx.isJson) {
        const response = await prompts({
          type: 'confirm',
          name: 'value',
          message: `Scaffold a Next.js app in ${chalk.cyan(ctx.cwd)}?`,
          initial: true,
        });

        if (!response.value) {
          logger.info('Aborted.');
          return;
        }
      }

      const originalCwd = process.cwd();
      let restoreLogger: (() => void) | undefined;

      try {
        process.chdir(ctx.cwd);

        if (ctx.isJson) {
          restoreLogger = logger.setSilent(true);
        }

        const noop = () => {
          return;
        };
        const spinner = ctx.isJson
          ? { start: noop, succeed: noop, fail: noop, stop: noop, text: '' }
          : ora('Scaffolding Next.js app...').start();
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

        // 14.4 Create the cn() helper (clsx/tailwind-merge are installed, but nothing
        // wrote the file every component/template imports it from)
        await createCnUtilNextJs(root);

        // 14.5 Create AGENTS.md guide for AI coding agents
        await writeAgentsFile(root);

        // 15. Initialize Git repository
        if (!ctx.isJson) {
          spinner.text = 'Initializing Git repository...';
          spinner.stop();
        }
        await execa('git', ['init'], { cwd: root, stdio: ctx.isJson ? 'ignore' : 'inherit' }).catch(
          () => {
            logger.warn('Git initialization failed, but continuing...');
          }
        );
        if (!ctx.isJson) spinner.start('Scaffolding Next.js app...');

        // 16. Install dependencies
        spinner.text = 'Installing dependencies...';
        const packageManager = await getPackageManager();
        const installArgs =
          packageManager === 'npm' ? ['install', '--legacy-peer-deps'] : ['install'];

        if (!ctx.isJson) {
          spinner.text = `Installing dependencies with ${packageManager}...`;
          spinner.stop();
        }
        await execa(packageManager, installArgs, {
          cwd: root,
          stdio: ctx.isJson ? 'ignore' : 'inherit',
        });
        if (!ctx.isJson) spinner.start('Finalizing...');

        spinner.succeed(chalk.green('Next.js app scaffolded successfully!'));
        if (ctx.isJson) {
          console.log(JSON.stringify({ success: true }, null, 2));
        }

        if (!ctx.isJson) {
          logger.info('\nNext steps:');
          logger.info(`1. Start dev server: ${chalk.cyan(`${packageManager} run dev`)}`);
          logger.info(`2. Open ${chalk.cyan('http://localhost:3000')} in your browser`);
          logger.info(`3. Add components: ${chalk.cyan('npx ignix add <component-name>')}`);
        }
      } catch (e) {
        if (ctx.isJson) {
          console.log(
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
        process.exitCode = 1;
      } finally {
        restoreLogger?.();
        process.chdir(originalCwd);
      }
    });
}

export const startersCommandNextjsApp = createStartersCommandNextjsApp();

export function createStartersCommandViteReact() {
  return new Command()
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

      if (!ctx.isYes && !ctx.isJson) {
        const response = await prompts({
          type: 'confirm',
          name: 'value',
          message: `Scaffold a Vite React app in ${chalk.cyan(ctx.cwd)}?`,
          initial: true,
        });

        if (!response.value) {
          logger.info('Aborted.');
          return;
        }
      }

      const originalCwd = process.cwd();
      let restoreLogger: (() => void) | undefined;

      try {
        process.chdir(ctx.cwd);

        if (ctx.isJson) {
          restoreLogger = logger.setSilent(true);
        }

        const noop = () => {
          return;
        };
        const spinner = ctx.isJson
          ? { start: noop, succeed: noop, fail: noop, stop: noop, text: '' }
          : ora('Scaffolding Vite + React app...').start();

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

        // 14.4 Create the cn() helper (clsx/tailwind-merge are installed, but nothing
        // wrote the file every component/template imports it from)
        await createCnUtilVite(root);

        // 14.5 Create AGENTS.md guide for AI coding agents
        await writeAgentsFile(root);

        // 16. Initialize Git repository
        if (!ctx.isJson) {
          spinner.text = 'Initializing Git repository...';
          spinner.stop();
        }
        await execa('git', ['init'], { cwd: root, stdio: ctx.isJson ? 'ignore' : 'inherit' }).catch(
          () => {
            logger.warn('Git initialization failed, but continuing...');
          }
        );
        if (!ctx.isJson) spinner.start('Scaffolding Vite + React app...');

        // 17. Install dependencies
        spinner.text = 'Installing dependencies...';
        const packageManager = await getPackageManager();
        const installArgs =
          packageManager === 'npm' ? ['install', '--legacy-peer-deps'] : ['install'];

        if (!ctx.isJson) {
          spinner.text = `Installing dependencies with ${packageManager}...`;
          spinner.stop();
        }
        await execa(packageManager, installArgs, {
          cwd: root,
          stdio: ctx.isJson ? 'ignore' : 'inherit',
        });
        if (!ctx.isJson) spinner.start('Finalizing...');

        spinner.succeed(chalk.green('Vite + React app scaffolded successfully!'));
        if (ctx.isJson) {
          console.log(JSON.stringify({ success: true }, null, 2));
        }

        if (!ctx.isJson) {
          logger.info('\nNext steps:');
          logger.info(`1. Start dev server: ${chalk.cyan(`${packageManager} run dev`)}`);
          logger.info(`2. Open ${chalk.cyan('http://localhost:5173')} in your browser`);
          logger.info(`3. Add components: ${chalk.cyan('npx ignix add <component-name>')}`);
        }
      } catch (e) {
        if (ctx.isJson) {
          console.log(
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
        process.exitCode = 1;
      } finally {
        restoreLogger?.();
        process.chdir(originalCwd);
      }
    });
}

export const startersCommandViteReact = createStartersCommandViteReact();
