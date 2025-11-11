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

      await setupTailwindInViteConfig();

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
  await fs.ensureDir(path.resolve('src/components/ui'));
  await fs.ensureDir(path.resolve('src/utils'));
}

async function createConfigFiles() {
  await createUtilsFile();
  await createLlmsTxtFile();
  await createIgnixConfigFIle();
}

async function setupIgnixUIAlias(): Promise<void> {
  const root = process.cwd();

  // 1️⃣ Update tsconfig.app.json (merge safely)
  const tsconfigPath = path.resolve(root, 'tsconfig.app.json');
  let tsconfig: any = {};

  if (await fs.pathExists(tsconfigPath)) {
    try {
      tsconfig = await fs.readJSON(tsconfigPath);
    } catch {
      tsconfig = {};
    }
  }

  // Ensure compilerOptions + paths
  tsconfig.compilerOptions = {
    ...(tsconfig.compilerOptions || {}),
    baseUrl: tsconfig.compilerOptions?.baseUrl || '.',
    paths: {
      ...(tsconfig.compilerOptions?.paths || {}),
      '@ignix-ui': ['./src/components/ui/index.ts'],
      '@ignix-ui/*': ['./src/components/ui/*'],
    },
  };

  // Write merged config back
  await fs.writeJSON(tsconfigPath, tsconfig, { spaces: 2 });
  logger.success('✔ Updated tsconfig.app.json with @ignix-ui alias');

  // 2️⃣ Update vite.config.ts alias
  const viteConfigPath = path.resolve(root, 'vite.config.ts');
  if (await fs.pathExists(viteConfigPath)) {
    let viteConfig = await fs.readFile(viteConfigPath, 'utf8');
    const aliasLine = `@ignix-ui: path.resolve(__dirname, "src/components/ui")`;

    if (!viteConfig.includes('@ignix-ui')) {
      const aliasRegex = /alias\s*:\s*\{([\s\S]*?)\}/m;
      if (aliasRegex.test(viteConfig)) {
        viteConfig = viteConfig.replace(aliasRegex, (match, inner) => {
          return `alias: {${inner.trimEnd()},\n      ${aliasLine}}`;
        });
      } else {
        const resolveRegex = /resolve\s*:\s*\{([\s\S]*?)\}/m;
        if (resolveRegex.test(viteConfig)) {
          viteConfig = viteConfig.replace(resolveRegex, (match, inner) => {
            return `resolve: {${inner.trimEnd()},\n    alias: { ${aliasLine} }}`;
          });
        } else {
          viteConfig += `
            resolve: {
              alias: {
                ${aliasLine}
              }
            },`;
        }
      }

      await fs.writeFile(viteConfigPath, viteConfig, 'utf8');
      logger.success('✔ Added @ignix-ui alias to vite.config.ts');
    } else {
      logger.info('ℹ @ignix-ui alias already exists in vite.config.ts — skipping');
    }
  } else {
    logger.error('⚠ vite.config.ts not found — skipping alias update');
  }

  // 2) Create plugins/webpack-alias.ts
  const pluginsDir = path.resolve(root, 'plugins');
  await fs.ensureDir(pluginsDir);
  const webpackAliasFile = path.join(pluginsDir, 'webpack-alias.ts');

  if (!(await fs.pathExists(webpackAliasFile))) {
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
      }
      `;
    await fs.writeFile(webpackAliasFile, pluginCode, 'utf8');
    logger.success('✔ Created plugins/webpack-alias.ts');
  } else {
    logger.info('plugins/webpack-alias.ts already exists — skipping');
  }
}

async function createUtilsFile() {
  const utilsPath = path.resolve('src/utils/cn.ts');
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

async function setupTailwindInViteConfig(): Promise<void> {
  const root = process.cwd();
  const viteConfigPaths = [path.join(root, 'vite.config.ts'), path.join(root, 'vite.config.js')];

  for (const configPath of viteConfigPaths) {
    if (await fs.pathExists(configPath)) {
      let content = await fs.readFile(configPath, 'utf-8');

      // Ensure import exists
      if (!content.includes('@tailwindcss/vite')) {
        content = `import tailwindcss from '@tailwindcss/vite';\n` + content;
      }

      // Ensure plugin is added
      if (!content.includes('tailwindcss()')) {
        content = content.replace(
          /plugins\s*:\s*\[([\s\S]*?)\]/,
          (match, inner) => `plugins: [${inner.trim()}${inner.trim() ? ', ' : ''}tailwindcss()]`
        );
      }

      await fs.writeFile(configPath, content, 'utf-8');
      logger.success('✅ TailwindCSS Vite plugin added to vite.config');
      return;
    }
  }

  logger.error(
    '⚠️ No vite.config.js or vite.config.ts found. Please add `@tailwindcss/vite` manually.'
  );
}
