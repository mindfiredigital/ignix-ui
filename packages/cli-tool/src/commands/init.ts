import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { DependencyService } from '../services/DependencyService';
import prompts from 'prompts';
import { ThemeService } from '../services/ThemeService';
import { loadConfig } from '../utils/config';
import axios from 'axios';

const DEFAULT_CONFIG_PATH = 'ignix.config.js';

export function createInitCommand() {
  return new Command()
    .name('init')
    .description(chalk.bold(chalk.hex('#FF7A3D')('Initialize Ignix UI in your project.')))
    .option('-y, --yes', 'Skip prompts')
    .option('-s, --silent', 'Silent mode')
    .option('--json', 'Machine output')
    .option('--cwd <path>', 'Working directory', '.')
    .action(async (opts) => {
      const ctx = {
        isYes: !!opts.yes,
        isJson: !!opts.json,
        cwd: path.resolve(opts.cwd || '.'),
        silent: !!opts.silent,
      };

      const originalCwd = process.cwd();
      let restoreLogger: (() => void) | undefined;
      process.chdir(ctx.cwd);

      type NoopSpinner = {
        start: () => void;
        stop: () => void;
        succeed: (msg?: string) => void;
        fail: (msg?: string) => void;
        text: string;
      };

      const noop = (): void => {
        return;
      };

      const spinner: ReturnType<typeof ora> | NoopSpinner = ctx.isJson
        ? {
            start: noop,
            stop: noop,
            succeed: noop,
            fail: noop,
            text: '',
          }
        : ora('Initializing Ignix UI...').start();

      if (ctx.isJson) {
        restoreLogger = logger.setSilent(true);
      }

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
        const config = await loadConfig();

        const { componentsDir, themesDir } = config;
        await fs.ensureDir(path.resolve(componentsDir));
        await fs.ensureDir(path.resolve(themesDir));
        logger.success('Created required directories.');

        // Ask about theming setup
        let setupTheming = true;

        if (!ctx.isYes) {
          const themingResponse = await prompts({
            type: 'select',
            name: 'setupTheming',
            message: 'Do you want to set up the Ignix theming system? (Recommended)',
            choices: [
              { title: 'Yes', value: true },
              { title: 'No', value: false },
            ],
          });

          setupTheming = themingResponse.setupTheming;
        }

        if (setupTheming === true) {
          spinner.text = 'Setting up theming system...';
          const themeService = new ThemeService();

          if (ctx.isJson) {
            themeService.setSilent(true);
          }

          // 1. Ask user to select a preset
          spinner.text = 'Fetching theme presets...';
          const availableThemes = await themeService.getAvailableThemes();
          spinner.stop();

          if (availableThemes.length > 0) {
            let themeId = null;

            if (!ctx.isYes) {
              const presetResponse = await prompts({
                type: 'select',
                name: 'themeId',
                message: 'Select a default theme preset to install:',
                choices: [
                  ...availableThemes.map((t) => ({ title: t.name, value: t.id })),
                  { title: 'None for now', value: null },
                ],
              });

              themeId = presetResponse?.themeId;
              if (themeId) {
                spinner.start('Installing selected theme preset...');
                await themeService.install(presetResponse.themeId);
              }
            }
          }
        }

        // 2. Install dependencies
        spinner.text = 'Installing required dependencies...';
        const depService = new DependencyService();
        await depService.install(['@mindfiredigital/ignix-ui'], false, ctx.isJson);
        await depService.install(['tailwindcss', '@tailwindcss/postcss'], true, ctx.isJson);

        spinner.succeed(chalk.green('Ignix UI initialized successfully!'));
        logger.info('\nNext steps:');
        logger.info(
          `1. Wrap your app in the <ThemeProvider> from ${chalk.cyan("'./themes/ThemeProvider'")}`
        );
        logger.info(
          `2. Add components with ${chalk.cyan('npx ignix add component <component-name>')}`
        );
        logger.info(`3. Explore themes with ${chalk.cyan('npx ignix themes list')}`);

        if (ctx.isJson) {
          console.log(
            JSON.stringify(
              {
                success: true,
                initialized: true,
              },
              null,
              2
            )
          );
        }
      } catch (error) {
        spinner.fail?.('Initialization failed.');

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
        } else {
          if (error instanceof Error) logger.error(error.message);
        }

        process.exit(1);
      } finally {
        restoreLogger?.();
        process.chdir(originalCwd);
      }
    });
}

export const initCommand = createInitCommand();

// Helper functions
async function validateEnvironment() {
  const hasPackageJson = await fs.pathExists(path.resolve('package.json'));
  if (!hasPackageJson) {
    throw new Error('No package.json found. Please run `npm init` or `yarn init` first.');
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
  await updateGlobalStyles();
}

async function setupIgnixUIAlias(): Promise<void> {
  const root = process.cwd();
  let templatesDir = path.resolve(__dirname, '../../templates');

  if (!(await fs.pathExists(templatesDir))) {
    // Fallback for bundled version
    templatesDir = path.resolve(__dirname, './templates');
  }

  // 1️⃣ Copy tsconfig.app.json template
  const tsconfigTemplatePath = path.join(templatesDir, 'tsconfig.app.json');
  const tsconfigPath = path.resolve(root, 'tsconfig.app.json');

  await fs.copy(tsconfigTemplatePath, tsconfigPath);
  logger.success('✔ Created tsconfig.app.json with @ignix-ui alias');

  // 2️⃣ Copy vite.config.ts template
  const viteConfigTemplatePath = path.join(templatesDir, 'vite.config.ts');
  const viteConfigPath = path.resolve(root, 'vite.config.ts');

  await fs.copy(viteConfigTemplatePath, viteConfigPath);
  logger.success('✔ Created vite.config.ts with @ignix-ui alias and TailwindCSS plugin');

  // 3) Create plugins/webpack-alias.ts
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
  const configTemplatePath = path.resolve(__dirname, '../../templates/ignix.config.js');
  if (await fs.pathExists(DEFAULT_CONFIG_PATH)) {
    logger.info('`ignix.config.js` already exists. Skipping creation.');
  } else {
    if (!(await fs.pathExists(configTemplatePath))) {
      // Fallback for bundled version
      const bundledTemplatePath = path.resolve(__dirname, './templates/ignix.config.js');
      if (await fs.pathExists(bundledTemplatePath)) {
        await fs.copy(bundledTemplatePath, DEFAULT_CONFIG_PATH);
      } else {
        throw new Error(
          `Config template not found at ${configTemplatePath} or ${bundledTemplatePath}`
        );
      }
    } else {
      await fs.copy(configTemplatePath, DEFAULT_CONFIG_PATH);
    }
    logger.success('Created `ignix.config.js`.');
  }
}

async function findGlobalCssFile(dir: string): Promise<string | null> {
  const possibleCssPaths = [
    // Next.js App Router (without src/)
    path.join(dir, 'app', 'globals.css'),
    path.join(dir, 'app', 'global.css'),
    // Next.js App Router (with src/)
    path.join(dir, 'src', 'app', 'globals.css'),
    path.join(dir, 'src', 'app', 'global.css'),
    // Next.js Pages Router or generic styles
    path.join(dir, 'src', 'styles', 'globals.css'),
    path.join(dir, 'src', 'styles', 'global.css'),
    // Vite/React / others
    path.join(dir, 'src', 'index.css'),
    path.join(dir, 'src', 'App.css'),
    path.join(dir, 'src', 'styles.css'),
    path.join(dir, 'src', 'app.css'),
    path.join(dir, 'app.css'),
    path.join(dir, 'index.css'),
  ];

  for (const cssPath of possibleCssPaths) {
    if (await fs.pathExists(cssPath)) {
      return cssPath;
    }
  }

  const targetNames = ['globals.css', 'global.css', 'index.css', 'app.css', 'styles.css'];
  const excludedDirs = ['node_modules', '.next', '.git', 'dist', 'build', 'out', 'coverage'];

  async function walk(currentDir: string): Promise<string | null> {
    try {
      const files = await fs.readdir(currentDir);
      for (const file of files) {
        const fullPath = path.join(currentDir, file);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          if (excludedDirs.includes(file) || file.startsWith('.')) {
            continue;
          }
          const found = await walk(fullPath);
          if (found) return found;
        } else if (stat.isFile()) {
          if (targetNames.includes(file.toLowerCase())) {
            return fullPath;
          }
        }
      }
    } catch (e) {
      // Ignore errors for unreadable directories
    }
    return null;
  }

  return walk(dir);
}

async function updateGlobalStyles() {
  const root = process.cwd();

  let customCssContent = '';

  try {
    const response = await axios.get(
      'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/apps/docs/src/css/custom.css'
    );
    customCssContent = response.data;
  } catch (fetchError) {
    logger.error('Failed to fetch custom styles from the Ignix UI GitHub repository.');
    if (fetchError instanceof Error) {
      logger.error(`Reason: ${fetchError.message}`);
    }
    return;
  }
  let cssFilePath = await findGlobalCssFile(root);

  // If no CSS file exists, create one in the most common location
  if (!cssFilePath) {
    // Check if it's a Next.js project
    const isNextJs =
      (await fs.pathExists(path.join(root, 'next.config.js'))) ||
      (await fs.pathExists(path.join(root, 'next.config.ts'))) ||
      (await fs.pathExists(path.join(root, 'src', 'app')));

    if (isNextJs) {
      cssFilePath = path.join(root, 'src', 'styles', 'globals.css');
      await fs.ensureDir(path.dirname(cssFilePath));
    } else {
      // Default to src/index.css for Vite/React
      cssFilePath = path.join(root, 'src', 'index.css');
      await fs.ensureDir(path.dirname(cssFilePath));
    }
  }

  if (cssFilePath) {
    // Read existing content if file exists
    let existingContent = '';
    if (await fs.pathExists(cssFilePath)) {
      existingContent = await fs.readFile(cssFilePath, 'utf-8');
    }

    // Merge or replace: if file has Tailwind directives, prepend custom.css, otherwise replace
    let finalContent = '';
    if (
      existingContent &&
      (existingContent.includes('@tailwind') || existingContent.includes('@import'))
    ) {
      // Merge: keep Tailwind directives and add custom.css content
      const tailwindDirectives =
        existingContent.match(/@(?:tailwind|import|theme)[^;{]+(?:{[^}]*}|;?)/g)?.join('\n') || '';
      const restOfContent = existingContent
        .replace(/@(?:tailwind|import|theme)[^;{]+(?:{[^}]*}|;?)\n?/g, '')
        .trim();

      // Extract @import 'tailwindcss' from custom.css if present
      const customCssWithoutTailwind = customCssContent
        .replace(/@import\s+['"]tailwindcss['"];?\n?/g, '')
        .trim();

      finalContent = `${tailwindDirectives}\n\n${customCssWithoutTailwind}\n\n${restOfContent}`.trim();
    } else {
      // Replace: use custom.css content
      finalContent = customCssContent;
    }

    await fs.writeFile(cssFilePath, finalContent, 'utf-8');
    logger.success(`✔ Updated ${path.relative(root, cssFilePath)} with custom styles`);
  }
}
