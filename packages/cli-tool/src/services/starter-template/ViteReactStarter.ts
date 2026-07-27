import path from 'path';
import fs from 'fs-extra';
import { logger } from '../../utils/logger';

/**
 * Vite + React Starter Service
 * Handles scaffolding of a blank Vite + React app with TypeScript, Tailwind CSS, and Ignix UI
 * Optimized for fast startup (<100ms) and dev server boot (<1s)
 */

// 1. Validate empty directory
export async function validateEmptyDirectory(root: string): Promise<void> {
  const files = await fs.readdir(root);
  const allowedFiles = ['.git', '.gitignore', 'README.md', '.DS_Store'];
  const filteredFiles = files.filter((file) => !allowedFiles.includes(file));

  if (filteredFiles.length > 0) {
    logger.warn(`Directory is not empty. Found: ${filteredFiles.join(', ')}. Continuing anyway...`);
  }
}

// 2. Create package.json for Vite React app
export async function createViteReactPackageJson(root: string): Promise<void> {
  const pkg = {
    name: 'ignix-vite-react-app',
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
      format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md,css}"',
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      '@mindfiredigital/ignix-ui': '^1.0.5',
      clsx: '^2.1.1',
      'tailwind-merge': '^3.0.2',
    },
    devDependencies: {
      '@types/node': '^24.10.1',
      '@types/react': '^18.3.3',
      '@types/react-dom': '^18.3.0',
      '@typescript-eslint/eslint-plugin': '^7.18.0',
      '@typescript-eslint/parser': '^7.18.0',
      '@vitejs/plugin-react': '^4.3.1',
      '@tailwindcss/vite': '^4.0.0',
      eslint: '^8.57.1',
      'eslint-plugin-react-hooks': '^4.6.2',
      'eslint-plugin-react-refresh': '^0.4.11',
      prettier: '^3.3.3',
      'prettier-plugin-tailwindcss': '^0.6.6',
      tailwindcss: '^4.0.0',
      typescript: '^5.6.2',
      vite: '^5.4.2',
    },
  };
  await fs.writeJSON(path.join(root, 'package.json'), pkg, { spaces: 2 });
}

// 3. Create TypeScript configuration
export async function createViteReactTsconfig(root: string): Promise<void> {
  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,

      /* Bundler mode */
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',

      /* Linting */
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,

      /* Path aliases */
      baseUrl: '.',
      paths: {
        '@/*': ['./src/*'],
        '@ignix-ui/*': ['./src/components/ui/*', './src/components/templates/*'],
      },
    },
    include: ['src'],
    references: [{ path: './tsconfig.node.json' }],
  };
  await fs.writeJSON(path.join(root, 'tsconfig.json'), tsconfig, { spaces: 2 });

  // Create tsconfig.node.json for Vite config
  const tsconfigNode = {
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true,
      strict: true,
      types: ['node'],
    },
    include: ['vite.config.ts'],
  };
  await fs.writeJSON(path.join(root, 'tsconfig.node.json'), tsconfigNode, { spaces: 2 });
}

// 4. Create Vite configuration with HMR optimization
export async function createViteConfig(root: string): Promise<void> {
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ignix-ui': path.resolve(__dirname, './src/components/ui'),
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
`;
  await fs.writeFile(path.join(root, 'vite.config.ts'), viteConfig);
}

// 5. Tailwind config is no longer needed in v4 for standard setups
export async function createTailwindConfig(_root: string): Promise<void> {
  // No-op for Tailwind v4
}

// 6. PostCSS config is optional in v4 with Vite plugin
export async function createPostCSSConfig(_root: string): Promise<void> {
  // No-op for Tailwind v4
}

// 7. Create ESLint configuration
export async function createESLintConfig(root: string): Promise<void> {
  const eslintConfig = `module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
`;
  await fs.writeFile(path.join(root, '.eslintrc.cjs'), eslintConfig);
}

// 8. Create Prettier configuration
export async function createPrettierConfig(root: string): Promise<void> {
  const prettierConfig = `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
`;
  await fs.writeFile(path.join(root, '.prettierrc'), prettierConfig);

  const prettierIgnore = `node_modules
dist
build
coverage
.vite
.env*.local
`;
  await fs.writeFile(path.join(root, '.prettierignore'), prettierIgnore);
}

// 9. Create index.html
export async function createIndexHtml(root: string): Promise<void> {
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ignix UI Vite React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  await fs.writeFile(path.join(root, 'index.html'), indexHtml);
}

// 10. Create src directory structure
export async function createSrcDirectory(root: string): Promise<void> {
  const srcDir = path.join(root, 'src');
  const componentsDir = path.join(srcDir, 'components', 'ui');
  const stylesDir = path.join(srcDir, 'styles');

  await fs.ensureDir(srcDir);
  await fs.ensureDir(componentsDir);
  await fs.ensureDir(stylesDir);

  // Create main entry point
  const mainTsx = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;
  await fs.writeFile(path.join(srcDir, 'main.tsx'), mainTsx);

  // Create App.tsx with ThemeProvider
  const appTsx = `import { ThemeProvider } from '@mindfiredigital/ignix-ui';

function App() {
  return (
    <ThemeProvider enableSystemPreference>
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Welcome to Ignix UI</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your Vite + React app is ready with TypeScript, Tailwind CSS, and Ignix UI.
          </p>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  Add components:{' '}
                  <code className="px-2 py-1 bg-muted rounded">
                    npx ignix add &lt;component-name&gt;
                  </code>
                </li>
                <li>
                  Explore themes:{' '}
                  <code className="px-2 py-1 bg-muted rounded">npx ignix themes list</code>
                </li>
                <li>
                  Start developing:{' '}
                  <code className="px-2 py-1 bg-muted rounded">npm run dev</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
`;
  await fs.writeFile(path.join(srcDir, 'App.tsx'), appTsx);
}

// 11. Create global styles
export async function createGlobalStyles(root: string): Promise<void> {
  const srcDir = path.join(root, 'src');
  await fs.ensureDir(srcDir);
  const indexCss = `@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

/*
 * Values below read from --ignix-* custom properties first, falling back to the
 * hardcoded value for the initial pre-JS paint. ThemeProvider (from
 * @mindfiredigital/ignix-ui) writes --ignix-* variables onto document.documentElement
 * at runtime - without this bridge, installed/applied themes have no visual effect,
 * since Tailwind here only ever reads the unprefixed names.
 */
:root {
  --background: var(--ignix-background, hsl(0 0% 100%));
  --foreground: var(--ignix-text, hsl(222.2 84% 4.9%));
  --primary: var(--ignix-primary, hsl(222.2 47.4% 11.2%));
  --primary-foreground: var(--ignix-text-inverse, hsl(210 40% 98%));
  --secondary: var(--ignix-secondary, hsl(210 40% 96.1%));
  --secondary-foreground: var(--ignix-text, hsl(222.2 47.4% 11.2%));
  --muted: var(--ignix-surface-alt, hsl(210 40% 96.1%));
  --muted-foreground: var(--ignix-text-muted, hsl(215.4 16.3% 46.9%));
  --accent: var(--ignix-accent, hsl(210 40% 96.1%));
  --accent-foreground: var(--ignix-text, hsl(222.2 47.4% 11.2%));
  --destructive: var(--ignix-error, hsl(0 84.2% 60.2%));
  --destructive-foreground: var(--ignix-text-inverse, hsl(210 40% 98%));
  --border: var(--ignix-border, hsl(214.3 31.8% 91.4%));
  --input: var(--ignix-border-light, hsl(214.3 31.8% 91.4%));
  --ring: var(--ignix-primary, hsl(222.2 84% 4.9%));
}

.dark {
  --background: var(--ignix-background, hsl(222.2 84% 4.9%));
  --foreground: var(--ignix-text, hsl(210 40% 98%));
  --primary: var(--ignix-primary, hsl(210 40% 98%));
  --primary-foreground: var(--ignix-text-inverse, hsl(222.2 47.4% 11.2%));
  --secondary: var(--ignix-secondary, hsl(217.2 32.6% 17.5%));
  --secondary-foreground: var(--ignix-text, hsl(210 40% 98%));
  --muted: var(--ignix-surface-alt, hsl(217.2 32.6% 17.5%));
  --muted-foreground: var(--ignix-text-muted, hsl(215 20.2% 65.1%));
  --accent: var(--ignix-accent, hsl(217.2 32.6% 17.5%));
  --accent-foreground: var(--ignix-text, hsl(210 40% 98%));
  --destructive: var(--ignix-error, hsl(0 62.8% 30.6%));
  --destructive-foreground: var(--ignix-text-inverse, hsl(210 40% 98%));
  --border: var(--ignix-border, hsl(217.2 32.6% 17.5%));
  --input: var(--ignix-border-light, hsl(217.2 32.6% 17.5%));
  --ring: var(--ignix-primary, hsl(212.7 26.8% 83.9%));
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;
  await fs.writeFile(path.join(srcDir, 'index.css'), indexCss);
}

// 12. Create Ignix config
export async function createIgnixConfig(root: string): Promise<void> {
  const ignixConfig = `/* eslint-env node */
/** @type {import('@mindfiredigital/ignix-cli').IgnixConfig} */
export default {
  // URL to the raw registry.json file on GitHub
  registryUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/registry.json',

  // URL to the raw themes.json file on GitHub
  themeUrl:
    'https://raw.githubusercontent.com/mindfiredigital/ignix-ui/main/packages/registry/themes.json',

  // Default directory for UI components
  componentsDir: 'src/components/ui',

  // Default directory for themes
  themesDir: 'src/themes',
};
`;
  await fs.writeFile(path.join(root, 'ignix.config.js'), ignixConfig);
}

// 13. Create .gitignore
export async function createGitignore(root: string): Promise<void> {
  const gitignore = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
build
coverage
.vite
`;
  await fs.writeFile(path.join(root, '.gitignore'), gitignore);
}

// 14. Create vite-env.d.ts for TypeScript
export async function createViteEnvTypes(root: string): Promise<void> {
  const srcDir = path.join(root, 'src');
  await fs.ensureDir(srcDir);
  const viteEnvTypes = `/// <reference types="vite/client" />
`;
  await fs.writeFile(path.join(srcDir, 'vite-env.d.ts'), viteEnvTypes);
}

// 15. Create the cn() helper - clsx/tailwind-merge are already installed as
// dependencies, but nothing previously wrote the file every installed component
// and template imports it from.
export async function createCnUtil(root: string): Promise<void> {
  const utilsDir = path.join(root, 'src', 'utils');
  await fs.ensureDir(utilsDir);
  const cnTs = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  await fs.writeFile(path.join(utilsDir, 'cn.ts'), cnTs);
}
