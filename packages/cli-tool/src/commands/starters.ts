import { Command } from 'commander';
import ora from 'ora';
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

const execa = async (...args: any[]): Promise<any> => {
  const { execa: execaImport } = await import('execa');
  // Cast to any to allow forwarding arbitrary args without tuple typing errors
  return (execaImport as any)(...args);
};

export const startersCommandMonorepo = new Command()
  .name('monorepo-starters')
  .description(chalk.hex('#33A06F')('Starter generators for monorepo.'))
  .command('monorepo')
  .description('Scaffold a Turborepo + pnpm workspaces monorepo')
  .action(async () => {
    const spinner = ora('Scaffolding monorepo...').start();
    try {
      // Scaffold monorepo structure
      const root = process.cwd();

      // 1. Ensure root files
      await ensureRootFiles(root);
      // 2. Ensure root tsconfig
      await ensureRootTsconfig(root);
      // 3. Scaffold packages and apps
      await scaffoldConfigPackage(root);
      // 4. Scaffold components package
      await scaffoldComponentsPackage(root);
      // 5. Ensure tsconfig under packages
      await ensureTsconfigPackage(root);
      // 6. Scaffold Next.js app
      await scaffoldNextApp(root);

      // 7. pnpm install
      await execa('pnpm', ['install'], { cwd: root, stdio: 'inherit' });
      // Final message
      spinner.succeed(chalk.green('Monorepo scaffolded successfully.'));
      spinner.succeed(chalk.green('Dependencies installed successfully.'));
      logger.info('\nNext steps:');
      logger.info(`2. Dev all: ${chalk.cyan('pnpm dev')}`);
      logger.info(`3. Build all: ${chalk.cyan('pnpm build')}`);
    } catch (e) {
      spinner.fail('Failed to scaffold monorepo');
      if (e instanceof Error) logger.error(e.message);
      process.exit(1);
    }
  });

export const startersCommandNextjsApp = new Command()
  .name('nextjs-starters')
  .description(chalk.hex('#33A06F')('Starter generators for nextjs-app.'))
  .command('nextjs-app')
  .description(
    'Scaffold a blank Next.js 14+ app with App Router, TypeScript, Tailwind CSS, and Ignix UI'
  )
  .action(async () => {
    const spinner = ora('Scaffolding Next.js app...').start();
    try {
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
      await execa('git', ['init'], { cwd: root, stdio: 'inherit' }).catch(() => {
        logger.warn('Git initialization failed, but continuing...');
      });

      // 16. Install dependencies
      spinner.text = 'Installing dependencies...';
      const packageManager = await getPackageManager();
      await execa(packageManager, ['install'], { cwd: root, stdio: 'inherit' });

      spinner.succeed(chalk.green('Next.js app scaffolded successfully!'));
      logger.info('\nNext steps:');
      logger.info(`1. Start dev server: ${chalk.cyan(`${packageManager} run dev`)}`);
      logger.info(`2. Open ${chalk.cyan('http://localhost:3000')} in your browser`);
      logger.info(`3. Add components: ${chalk.cyan('npx ignix add <component-name>')}`);
    } catch (e) {
      spinner.fail('Failed to scaffold Next.js app');
      if (e instanceof Error) logger.error(e.message);
      process.exit(1);
    }
  });
