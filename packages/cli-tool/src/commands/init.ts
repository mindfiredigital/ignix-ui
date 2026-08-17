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

const DEFAULT_CONFIG_PATH = 'ignix.config.js';

export function createInitCommand(): Command {
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

        // 3. Detect or prompt for the global CSS file path
        const globalCssPath = await interactiveCssPrompt(ctx.cwd, ctx.isYes);

        // 4. Create config files
        await createConfigFiles(globalCssPath);

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

        process.exitCode = 1;
      } finally {
        restoreLogger?.();
        process.chdir(originalCwd);
      }
    });
}

export const initCommand = createInitCommand();

// Helper functions
async function validateEnvironment(): Promise<void> {
  const hasPackageJson = await fs.pathExists(path.resolve('package.json'));
  if (!hasPackageJson) {
    throw new Error('No package.json found. Please run `npm init` or `yarn init` first.');
  }
}

async function createProjectStructure(): Promise<void> {
  await fs.ensureDir(path.resolve('src/components/ui'));
  await fs.ensureDir(path.resolve('src/utils'));
}

async function createConfigFiles(globalCssPath: string): Promise<void> {
  await createUtilsFile();
  await createLlmsTxtFile();
  await createIgnixConfigFIle(globalCssPath);
  await updateGlobalStyles(globalCssPath);
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

async function createUtilsFile(): Promise<void> {
  const utilsPath = path.resolve('src/utils/cn.ts');
  if (await fs.pathExists(utilsPath)) return;

  const content = `import { clsx, type ClassValue } from 'clsx'
  import { twMerge } from 'tailwind-merge'
  
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }`;

  await fs.writeFile(utilsPath, content);
}

async function createLlmsTxtFile(): Promise<void> {
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

async function createIgnixConfigFIle(globalCssPath: string): Promise<void> {
  if (await fs.pathExists(DEFAULT_CONFIG_PATH)) {
    logger.info('`ignix.config.js` already exists. Skipping creation.');
    return;
  }

  const relativeCssPath = path.relative(process.cwd(), globalCssPath).replace(/\\/g, '/');

  const configContent = `/* eslint-env node */
/** @type {import('@mindfiredigital/ignix-cli').IgnixConfig} */
module.exports = {
  // URL to the raw registry.json file on GitHub
  registryUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/registry.json',

  // URL to the raw themes.json file on GitHub
  themeUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/themes.json',

  //URL for the templates
  templateLayoutUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/',

  // Path to your global CSS file (detected automatically by ignix init)
  globalCss: '${relativeCssPath}',

  // Default directory for UI components
  componentsDir: 'src/components/ui',

  // Default directory for themes
  themesDir: 'src/themes',

  // Default directory for templates
  templateLayoutDir: 'src/components/templates',
};
`;

  await fs.writeFile(DEFAULT_CONFIG_PATH, configContent, 'utf-8');
  logger.success('Created `ignix.config.js`.');
}

async function interactiveCssPrompt(root: string, isYes: boolean): Promise<string> {
  // Check if config already has a globalCss path saved from a previous run
  try {
    const existingConfig = await loadConfig();
    if (existingConfig.globalCss) {
      const savedPath = path.resolve(root, existingConfig.globalCss);
      if (await fs.pathExists(savedPath)) {
        logger.info(`Using stylesheet from config: ${existingConfig.globalCss}`);
        return savedPath;
      }
    }
  } catch (e) {
    // Config doesn't exist yet, proceed normally
  }

  // Auto-detect candidate stylesheet in the project
  const detected = await findGlobalCssFile(root);

  // Determine the default suggestion
  const hasSrcApp = await fs.pathExists(path.join(root, 'src', 'app'));
  const hasApp = await fs.pathExists(path.join(root, 'app'));

  const defaultSuggestion = detected
    ? path.relative(root, detected).replace(/\\/g, '/')
    : hasSrcApp
    ? 'src/app/globals.css'
    : hasApp
    ? 'app/globals.css'
    : 'src/index.css';

  let chosenRelativePath = defaultSuggestion;

  if (!isYes) {
    const response = await prompts({
      type: 'text',
      name: 'globalCss',
      message: 'Where is your global CSS file?',
      initial: defaultSuggestion,
    });

    // Handle Ctrl+C (cancelled prompt)
    if (response.globalCss === undefined) {
      chosenRelativePath = defaultSuggestion;
    } else {
      chosenRelativePath = response.globalCss;
    }
  }

  const resolvedPath = path.resolve(root, chosenRelativePath);

  // Create the file (and its parent directories) if it doesn't exist yet
  if (!(await fs.pathExists(resolvedPath))) {
    await fs.ensureDir(path.dirname(resolvedPath));
    await fs.writeFile(resolvedPath, '', 'utf-8');
    logger.info(`Created new stylesheet: ${chosenRelativePath}`);
  }

  return resolvedPath;
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

  const targetNames = ['globals.css', 'global.css', 'index.css', 'app.css', 'styles.css'];
  const excludedDirs = ['node_modules', '.next', '.git', 'dist', 'build', 'out', 'coverage'];
  const startMarker = '/* --- Ignix UI Custom Styles Start --- */';

  // 1. First scan: check if any CSS file in the project already has our marker.
  // This guarantees we always target the exact same file in subsequent runs.
  async function findFileWithMarker(currentDir: string): Promise<string | null> {
    try {
      const files = await fs.readdir(currentDir);
      for (const file of files) {
        try {
          const fullPath = path.join(currentDir, file);
          const stat = await fs.lstat(fullPath);
          if (stat.isSymbolicLink()) {
            continue;
          }
          if (stat.isDirectory()) {
            if (excludedDirs.includes(file) || file.startsWith('.')) {
              continue;
            }
            const found = await findFileWithMarker(fullPath);
            if (found) return found;
          } else if (stat.isFile() && file.endsWith('.css')) {
            const content = await fs.readFile(fullPath, 'utf-8');
            if (content.includes(startMarker)) {
              return fullPath;
            }
          }
        } catch (e) {
          // Skip inaccessible paths
        }
      }
    } catch (e) {
      // Ignore walk errors
    }
    return null;
  }

  const fileWithMarker = await findFileWithMarker(dir);
  if (fileWithMarker) {
    return fileWithMarker;
  }

  const candidates: { path: string; hasTailwind: boolean }[] = [];

  async function inspectAndAddCandidate(filePath: string): Promise<void> {
    try {
      if (await fs.pathExists(filePath)) {
        const stat = await fs.lstat(filePath);
        if (!stat.isSymbolicLink()) {
          const content = await fs.readFile(filePath, 'utf-8');
          const hasTailwind =
            content.includes('@tailwind') ||
            content.includes('@import "tailwindcss"') ||
            content.includes("@import 'tailwindcss'") ||
            content.includes('@import "tailwindcss/utilities"') ||
            content.includes('@import "tailwindcss/base"');
          candidates.push({ path: filePath, hasTailwind });
        }
      }
    } catch (e) {
      // Ignore reading/stat errors
    }
  }

  // Check the standard predefined paths first
  for (const cssPath of possibleCssPaths) {
    await inspectAndAddCandidate(cssPath);
  }

  // If one of standard candidates has tailwind, return it immediately
  const tailwindCandidate = candidates.find((c) => c.hasTailwind);
  if (tailwindCandidate) {
    return tailwindCandidate.path;
  }

  async function walk(currentDir: string): Promise<void> {
    try {
      const files = await fs.readdir(currentDir);
      for (const file of files) {
        try {
          const fullPath = path.join(currentDir, file);
          const stat = await fs.lstat(fullPath);
          if (stat.isSymbolicLink()) {
            continue;
          }
          if (stat.isDirectory()) {
            if (excludedDirs.includes(file) || file.startsWith('.')) {
              continue;
            }
            await walk(fullPath);
          } else if (stat.isFile()) {
            if (targetNames.includes(file.toLowerCase())) {
              if (!candidates.some((c) => c.path === fullPath)) {
                await inspectAndAddCandidate(fullPath);
              }
            }
          }
        } catch (e) {
          // Skip inaccessible paths
        }
      }
    } catch (e) {
      // Ignore walk errors
    }
  }

  await walk(dir);

  // Search the entire list of candidates for tailwind
  const bestCandidate = candidates.find((c) => c.hasTailwind);
  if (bestCandidate) {
    return bestCandidate.path;
  }

  // Fallback: return the first found candidate if any exist
  if (candidates.length > 0) {
    return candidates[0].path;
  }

  return null;
}

async function updateGlobalStyles(cssFilePath: string): Promise<void> {
  const root = process.cwd();

  let customCssContent = '';

  try {
    // Resolve from the CLI's bundled templates directory
    let templatesDir = path.resolve(__dirname, '../../templates');
    if (!(await fs.pathExists(templatesDir))) {
      templatesDir = path.resolve(__dirname, './templates');
    }
    const cssTemplatePath = path.join(templatesDir, 'ignix.css');

    if (await fs.pathExists(cssTemplatePath)) {
      customCssContent = await fs.readFile(cssTemplatePath, 'utf-8');
    } else {
      throw new Error(`Ignix CSS template not found at ${cssTemplatePath}`);
    }
  } catch (fetchError) {
    logger.error('Failed to load custom styles from the bundled CLI template.');
    if (fetchError instanceof Error) {
      logger.error(`Reason: ${fetchError.message}`);
    }
    return;
  }

  // Read existing content if file exists
  let existingContent = '';
  const fileExists = await fs.pathExists(cssFilePath);
  if (fileExists) {
    existingContent = await fs.readFile(cssFilePath, 'utf-8');
  }

  const startMarker = '/* --- Ignix UI Custom Styles Start --- */';
  const endMarker = '/* --- Ignix UI Custom Styles End --- */';

  // Determine if the file already has Tailwind directives
  const alreadyHasTailwind =
    existingContent.includes('@tailwind') ||
    existingContent.includes('@import "tailwindcss"') ||
    existingContent.includes("@import 'tailwindcss'");

  const customCssClean = alreadyHasTailwind
    ? customCssContent.replace(/@import\s+['"]tailwindcss['"];?\n?/g, '').trim()
    : customCssContent.replace(/@import\s+['"]tailwindcss['"];?\n?/g, '').trim();

  let finalContent = '';
  if (existingContent.includes(startMarker)) {
    // Update the block in-place without touching anything else
    const startIndex = existingContent.indexOf(startMarker);
    const endIndex = existingContent.indexOf(endMarker);
    if (endIndex > startIndex) {
      const before = existingContent.substring(0, startIndex);
      const after = existingContent.substring(endIndex + endMarker.length);
      finalContent = `${before}${startMarker}\n${customCssClean}\n${endMarker}${after}`;
    } else {
      // Fallback if marker structure is corrupted
      const cleanedExisting = existingContent
        .replace(startMarker, '')
        .replace(endMarker, '')
        .trim();
      finalContent = `${cleanedExisting}\n\n${startMarker}\n${customCssClean}\n${endMarker}`;
    }
  } else if (existingContent.trim()) {
    // File has content — check if we can place it after a Tailwind directive
    const tailwindMatch = existingContent.match(/@(?:tailwind|import|theme)[^;{]+(?:{[^}]*}|;?)/g);
    if (alreadyHasTailwind && tailwindMatch) {
      const lastDirective = tailwindMatch[tailwindMatch.length - 1];
      const lastDirectiveIndex = existingContent.lastIndexOf(lastDirective) + lastDirective.length;
      const before = existingContent.substring(0, lastDirectiveIndex);
      const after = existingContent.substring(lastDirectiveIndex);
      finalContent = `${before}\n\n${startMarker}\n${customCssClean}\n${endMarker}\n${after}`.trim();
    } else {
      // No Tailwind directive was present in the file.
      // We must prepend `@import 'tailwindcss';` at the top of the stylesheet (before existing rules),
      // and append our custom style block at the end.
      finalContent = `@import 'tailwindcss';\n\n${existingContent.trim()}\n\n${startMarker}\n${customCssClean}\n${endMarker}`;
    }
  } else {
    // Empty file — write styles directly
    finalContent = `${startMarker}\n${customCssContent.trim()}\n${endMarker}`;
  }

  await fs.writeFile(cssFilePath, finalContent, 'utf-8');
  if (fileExists && existingContent.trim()) {
    logger.success(`✔ Updated ${path.relative(root, cssFilePath)} with custom styles`);
  } else {
    logger.success(`✔ Created ${path.relative(root, cssFilePath)} with custom styles`);
  }
}
