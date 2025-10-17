import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { DependencyService } from '../services/DependencyService';
import prompts from 'prompts';
import { ThemeService } from '../services/ThemeService';

const DEFAULT_CONFIG_PATH = 'ignix.config.js';
const TAILWIND_CONFIG_PATH = 'tailwind.config.js';

export const initCommand = new Command()
  .name('init')
  .description(chalk.bold(chalk.hex('#FF7A3D')('Initialize Ignix UI in your project.')))
  .action(async () => {
    const spinner = ora('Initializing Ignix UI...').start();

    try {
      // 1. Validate environment
      await validateEnvironment();

      // 2. Create project structure
      await createProjectStructure();

      // 3. Create config files
      await createConfigFiles();

      // 4. Set up Ignix UI alias
      await setupIgnixUIAlias();

      // 5. Create directories
      const configPath = path.resolve(process.cwd(), DEFAULT_CONFIG_PATH);

      // Read the config file as text first to determine its format
      const configContent = await fs.readFile(configPath, 'utf-8');
      const isESM =
        configContent.includes('export default') || configContent.includes('export const');

      let config;
      try {
        if (isESM) {
          // For ESM, we need to use dynamic import with file:// URL
          const fileUrl = `file://${configPath}${
            path.extname(configPath) === '.mjs' ? '' : '?t=' + Date.now()
          }`;
          const module = await import(fileUrl);
          config = module.default || module;
        } else {
          // For CommonJS
          delete require.cache[require.resolve(configPath)];
          // Create a temporary file with the config content
          const tempFile = path.join(process.cwd(), 'temp-config.cjs');
          await fs.writeFile(
            tempFile,
            `module.exports = ${configContent.replace(/^module\.exports\s*=\s*|\s*;?\s*$/g, '')};`
          );
          config = require(tempFile);
          // Clean up the temporary file
          await fs.remove(tempFile).catch((e) => {
            logger.warn(`Failed to remove temporary file: ${e}`);
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error(`Failed to load config: ${errorMessage}`);
        throw error;
      }

      const { componentsDir, themesDir } = config;
      await fs.ensureDir(path.resolve(componentsDir));
      await fs.ensureDir(path.resolve(themesDir));
      logger.success('Created required directories.');

      // Ask about theming setup
      const themingResponse = await prompts({
        type: 'select',
        name: 'setupTheming',
        message: 'Do you want to set up the Ignix theming system? (Recommended)',
        choices: [
          { title: 'Yes', value: true },
          { title: 'No', value: false },
        ],
      });

      if (themingResponse.setupTheming === true) {
        spinner.text = 'Setting up theming system...';
        const themeService = new ThemeService();

        // 1. Ask user to select a preset
        spinner.text = 'Fetching theme presets...';
        const availableThemes = await themeService.getAvailableThemes();
        spinner.stop();

        if (availableThemes.length > 0) {
          const presetResponse = await prompts({
            type: 'select',
            name: 'themeId',
            message: 'Select a default theme preset to install:',
            choices: [
              ...availableThemes.map((t) => ({ title: t.name, value: t.id })),
              { title: 'None for now', value: null },
            ],
          });

          if (presetResponse.themeId) {
            spinner.start('Installing selected theme preset...');
            await themeService.install(presetResponse.themeId);
          }
        }
      }

      // 2. Install dependencies
      spinner.text = 'Installing required dependencies...';
      const depService = new DependencyService();
      await depService.install(['@mindfiredigital/ignix-ui'], false);
      await depService.install(['tailwindcss'], true);

      spinner.succeed(chalk.green('Ignix UI initialized successfully!'));
      logger.info('\nNext steps:');
      logger.info(
        `1. Wrap your app in the <ThemeProvider> from ${chalk.cyan("'./themes/ThemeProvider'")}`
      );
      logger.info(
        `2. Add components with ${chalk.cyan('npx ignix add component <component-name>')}`
      );
      logger.info(`3. Explore themes with ${chalk.cyan('npx ignix themes list')}`);
    } catch (error) {
      spinner.fail('Initialization failed.');
      if (error instanceof Error) {
        logger.error(error.message);
      }
      process.exit(1);
    }
  });

// Helper functions
async function validateEnvironment() {
  const hasPackageJson = await fs.pathExists(path.resolve('package.json'));
  if (!hasPackageJson) {
    throw new Error('No package.json found. Please run `npm init` or `yarn init` first.');
  }

  const hasNodeModules = await fs.pathExists('node_modules');
  if (!hasNodeModules) {
    throw new Error('node_modules not found. Please run `npm install` or `yarn install` first.');
  }
}

async function createProjectStructure() {
  await fs.ensureDir(path.resolve('components/ui'));
  await fs.ensureDir(path.resolve('lib/utils'));
}

async function createConfigFiles() {
  await createUtilsFile();
  await createLlmsTxtFile();
  await createIgnixConfigFIle();
  await createTailwindConfigFile();
}

async function setupIgnixUIAlias() {
  const root = process.cwd();
  const rootTsconfigPath = path.resolve(root, 'tsconfig.json');
  let rootTsconfig: any = {};

  if (await fs.pathExists(rootTsconfigPath)) {
    try {
      rootTsconfig = await fs.readJSON(rootTsconfigPath);
    } catch {
      rootTsconfig = {};
    }
  }

  rootTsconfig.compilerOptions = {
    ...(rootTsconfig.compilerOptions || {}),
    baseUrl: rootTsconfig.compilerOptions?.baseUrl || '.',
    paths: {
      ...(rootTsconfig.compilerOptions?.paths || {}),
      '@ignix-ui/components/*': ['node_modules/@mindfiredigital/ignix-ui/components/*'],
    },
  };

  await fs.writeJSON(rootTsconfigPath, rootTsconfig, { spaces: 2 });
  logger.success('Root tsconfig.json updated with @ignix-ui alias');

  // Create webpack alias plugin if using webpack
  const pluginsDir = path.resolve(root, 'plugins');
  const webpackAliasFile = path.join(pluginsDir, 'webpack-alias.ts');

  if (!(await fs.pathExists(webpackAliasFile))) {
    await fs.ensureDir(pluginsDir);
    const pluginCode = `import path from 'path';
  
  export default function webpackAliasPlugin() {
    return {
      name: 'webpack-alias-plugin',
      configureWebpack() {
        return {
          resolve: {
            alias: {
              '@ignix-ui': path.resolve(process.cwd(), 'node_modules/@mindfiredigital/ignix-ui/components'),
            },
          },
        };
      },
    };
  }`;
    await fs.writeFile(webpackAliasFile, pluginCode, 'utf8');
    logger.success('Created plugins/webpack-alias.ts');
  }
}

async function createUtilsFile() {
  const utilsPath = path.resolve('utils/cn.ts');
  if (await fs.pathExists(utilsPath)) return;

  const content = `import { clsx, type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'
  
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }`;

  await fs.writeFile(utilsPath, content);
}

async function createLlmsTxtFile() {
  const filePath = path.resolve('llms.txt');
  if (await fs.pathExists(filePath)) return;

  const content = `# Ignix UI
  A command-line interface (CLI) for managing and developing Ignix UI components.
  
  ## Project Overview
  - **Primary Language**: TypeScript
  - **Framework**: React
  - **Styling**: Tailwind CSS
  
  ## Key Directories
  - components/ui/: Where components are installed
  - lib/utils/: Utility functions
  
  ## CLI Commands
  - \`ignix init\`: Initialize Ignix UI
  - \`ignix add <component>\`: Add a component
  - \`ignix themes\`: Manage themes`;

  await fs.writeFile(filePath, content);
}

async function createIgnixConfigFIle() {
  const configTemplatePath = path.resolve(__dirname, './templates/ignix.config.js');
  if (await fs.pathExists(DEFAULT_CONFIG_PATH)) {
    logger.info('`ignix.config.js` already exists. Skipping creation.');
  } else {
    await fs.copy(configTemplatePath, DEFAULT_CONFIG_PATH);
    logger.success('Created `ignix.config.js`.');
  }
}

async function createTailwindConfigFile() {
  const tailwindTemplatePath = path.resolve(__dirname, './templates/tailwind.config.js');
  if (await fs.pathExists(TAILWIND_CONFIG_PATH)) {
    logger.info('`tailwind.config.js` already exists. Please merge configurations manually.');
  } else {
    await fs.copy(tailwindTemplatePath, TAILWIND_CONFIG_PATH);
    logger.success('Created `tailwind.config.js`.');
  }
}
