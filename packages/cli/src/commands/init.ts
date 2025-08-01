import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { DependencyService } from '../services/DependencyService';
import { PROJECT_PATHS } from '../config/constants';
import { Logger } from '../utils/logger';
import { CLIError } from '../errors/CLIError';

export class InitCommand {
  private logger = new Logger();
  private dependencyService = DependencyService.getInstance();

  async execute(): Promise<void> {
    const spinner = ora('Initializing animation-ui...').start();

    try {
      // Validate environment
      await this.validateEnvironment();

      // Execute initialization steps
      await this.createProjectStructure();
      await this.createConfigFiles();
      await this.installDependencies();
      await this.addColorVariablesToCss();

      spinner.succeed('Successfully initialized animation-ui');
      this.logger.printInitInstructions();
    } catch (error) {
      spinner.fail();
      if (error instanceof CLIError) {
        this.logger.error(error.message, error.suggestions);
      } else {
        this.logger.error(error instanceof Error ? error.message : 'Unknown error');
      }
      process.exit(1);
    }
  }

  private async addColorVariablesToCss(): Promise<void> {
    const possiblePaths = [
      'src/globals.css',
      'src/index.css',
      'src/App.css',
      'app/globals.css',
      'styles/globals.css',
      'style.css',
      'src/style.css',
      'globals.css',
    ];

    let targetPath: string | null = null;

    for (const p of possiblePaths) {
      const fullPath = path.resolve(p);
      if (await fs.pathExists(fullPath)) {
        targetPath = fullPath;
        break;
      }
    }

    if (targetPath) {
      this.logger.info(`Found CSS file at ${targetPath}. Appending color variables...`);
      const colorVariables = `
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --warning: #d93636;
    --warning-foreground: #ffffff;
    --success: #22c55d;
    --success-foreground: #ffffff;
    --error: #ef4444;
    --error-foreground: #ffffff;
    --primary-light: 222.2 47.4% 11.2%;
    --primary-dark: 222.2 84% 4.9%;
    --destructive-light: #ef4444; /* red-400 */
    --destructive-dark: #b91c1c; /* red-700 */
    --success-light: #34d399; /* emerald-400 */
    --success-dark: #047857; /* emerald-700 */
    --warning-light: #fbbf24; /* yellow-300 */
    --warning-dark: #b45309; /* yellow-500 */
    --info: #06b6d4; /* cyan-500 */
    --info-light: #22d3ee; /* cyan-400 */
    --info-dark: #0e7490; /* cyan-600 */
    --info-foreground: #ffffff;

  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --warning: #d93636;
    --warning-foreground: #ffffff;
    --success: #22c55d;
    --success-foreground: #ffffff;
    --error: #ef4444;
    --error-foreground: #ffffff;
    --primary-light: 222.2 47.4% 11.2%;
    --primary-dark: 222.2 84% 4.9%;
    --destructive-light: #ef4444; /* red-400 */
    --destructive-dark: #b91c1c; /* red-700 */
    --success-light: #34d399; /* emerald-400 */
    --success-dark: #047857; /* emerald-700 */
    --warning-light: #fbbf24; /* yellow-300 */
    --warning-dark: #b45309; /* yellow-500 */
    --info: #06b6d4; /* cyan-500 */
    --info-light: #22d3ee; /* cyan-400 */
    --info-dark: #0e7490; /* cyan-600 */
    --info-foreground: #ffffff;
  }
}

@theme inline{
  --color-primary: var(--primary);
  --color-background: var(--background);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);  
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-warning: var(--warning);
  --color-success: var(--success);
  --color-error: var(--error);
  --color-warning-foreground: var(--warning-foreground);
  --color-success-foreground: var(--success-foreground);
  --color-error-foreground: var(--error-foreground);
  --color-primary-light: var(--primary-light);
  --color-primary-dark: var(--primary-dark);
  --color-destructive-light: var(--destructive-light);
  --color-destructive-dark: var(--destructive-dark);
  --color-success-light: var(--success-light);
  --color-success-dark: var(--success-dark);
  --color-warning-light: var(--warning-light);
  --color-warning-dark: var(--warning-dark);
  --color-info: var(--info);
  --color-info-light: var(--info-light);
  --color-info-dark: var(--info-dark);
  --color-info-foreground: var(--info-foreground);
}
`;
      try {
        await fs.appendFile(targetPath, colorVariables);
        this.logger.success(`Appended color variables to ${targetPath}`);
      } catch (error) {
        this.logger.error(`Could not write to ${targetPath}. Please add the variables manually.`);
      }
    } else {
      this.logger.info('Could not find a default CSS file. Skipping CSS variable injection.');
      this.logger.info('You can add the color variables to your global CSS file manually.');
    }
  }

  /**
   * Validates the project environment before initialization
   */
  private async validateEnvironment(): Promise<void> {
    // Check if package.json exists
    const hasPackageJson = await fs.pathExists(
      path.resolve(PROJECT_PATHS.CONFIG_FILES.PACKAGE_JSON)
    );
    if (!hasPackageJson) {
      throw new CLIError('No package.json found', 'INVALID_ENV', [
        'Run `npm init` or `yarn init` first',
      ]);
    }

    // Check if project structure is valid
    const hasNodeModules = await fs.pathExists('node_modules');
    if (!hasNodeModules) {
      throw new CLIError('node_modules not found', 'INVALID_ENV', [
        'Run `npm install` or `yarn install` first',
      ]);
    }
  }

  private async createProjectStructure(): Promise<void> {
    const uiDir = path.resolve(PROJECT_PATHS.COMPONENTS_DIR);
    const utilsDir = path.resolve(PROJECT_PATHS.UTILS_DIR);

    await fs.ensureDir(uiDir);
    await fs.ensureDir(utilsDir);
  }

  private async createConfigFiles(): Promise<void> {
    await this.createTailwindConfig();
    await this.createUtilsFile();
  }

  private async createTailwindConfig(): Promise<void> {
    const configPath = path.resolve(PROJECT_PATHS.CONFIG_FILES.TAILWIND);
    if (await fs.pathExists(configPath)) return;

    const config = `module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slideUpAndFade: 'slideUpAndFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade: 'slideDownAndFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}`;

    await fs.writeFile(configPath, config);
  }

  private async createUtilsFile(): Promise<void> {
    const utilsPath = path.resolve(PROJECT_PATHS.UTILS_DIR, 'cn.ts');
    if (await fs.pathExists(utilsPath)) return;

    const content = `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

    await fs.writeFile(utilsPath, content);
  }

  private async installDependencies(): Promise<void> {
    const dependencies = ['framer-motion', 'clsx', 'tailwind-merge'];
    const devDependencies = ['tailwindcss', 'autoprefixer', 'postcss'];

    await this.dependencyService.installDependencies(dependencies);
    await this.dependencyService.installDependencies(devDependencies);
  }
}
