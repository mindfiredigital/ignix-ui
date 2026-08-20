import path from 'path';
import fs from 'fs-extra';
import { logger } from '../../utils/logger';

/**
 * Next.js App Starter Service
 * Handles scaffolding of a blank Next.js 14+ app with App Router, TypeScript, Tailwind CSS, and Ignix UI
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

// 2. Create package.json for Next.js app
export async function createNextAppPackageJson(root: string): Promise<void> {
  const pkg = {
    name: 'ignix-nextjs-app',
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"',
    },
    dependencies: {
      next: '^14.2.0',
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      '@mindfiredigital/ignix-ui': '^1.0.5',
      clsx: '^2.1.1',
      'tailwind-merge': '^3.0.2',
    },
    devDependencies: {
      '@types/node': '^20.16.11',
      '@types/react': '^18.3.3',
      '@types/react-dom': '^18.3.0',
      typescript: '^5.6.2',
      tailwindcss: '^4.0.0',
      '@tailwindcss/postcss': '^4.0.0',
      eslint: '^8.57.1',
      'eslint-config-next': '^14.2.0',
      prettier: '^3.3.3',
      'prettier-plugin-tailwindcss': '^0.6.6',
    },
  };
  await fs.writeJSON(path.join(root, 'package.json'), pkg, { spaces: 2 });
}

// 3. Create TypeScript configuration for Next.js
export async function createNextAppTsconfig(root: string): Promise<void> {
  const tsconfig = {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [
        {
          name: 'next',
        },
      ],
      paths: {
        '@/*': ['./src/*'],
        '@ignix-ui/*': ['./src/components/ui/*', './src/components/templates/*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  };
  await fs.writeJSON(path.join(root, 'tsconfig.json'), tsconfig, { spaces: 2 });
}

// 4. Create Next.js configuration
export async function createNextConfig(root: string): Promise<void> {
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
`;
  await fs.writeFile(path.join(root, 'next.config.js'), nextConfig);
}

// 5. Tailwind config is no longer needed in v4 for standard setups
export async function createTailwindConfig(_root: string): Promise<void> {
  // No-op for Tailwind v4
}

// 6. Create PostCSS configuration
export async function createPostCSSConfig(root: string): Promise<void> {
  const postcssConfig = `module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
`;
  await fs.writeFile(path.join(root, 'postcss.config.js'), postcssConfig);
}

// 7. Create ESLint configuration
export async function createESLintConfig(root: string): Promise<void> {
  const eslintConfig = {
    extends: ['next/core-web-vitals'],
  };
  await fs.writeJSON(path.join(root, '.eslintrc.json'), eslintConfig, { spaces: 2 });
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
.next
out
dist
build
coverage
.vercel
.env*.local
`;
  await fs.writeFile(path.join(root, '.prettierignore'), prettierIgnore);
}

// 9. Create app directory structure with layout and page
export async function createAppDirectory(root: string): Promise<void> {
  const appDir = path.join(root, 'src', 'app');
  await fs.ensureDir(appDir);

  // Create providers.tsx (client component wrapper for ThemeProvider)
  const providers = `'use client';

import { ThemeProvider } from '@mindfiredigital/ignix-ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystemPreference>
      {children}
    </ThemeProvider>
  );
}
`;
  await fs.writeFile(path.join(appDir, 'providers.tsx'), providers);

  // Create layout.tsx with ThemeProvider
  const layout = `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ignix UI Next.js App',
  description: 'A Next.js app with Ignix UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
`;
  await fs.writeFile(path.join(appDir, 'layout.tsx'), layout);

  // Create page.tsx
  const page = `export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to Ignix UI</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your Next.js app is ready with App Router, TypeScript, Tailwind CSS, and Ignix UI.
        </p>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Add components: <code className="px-2 py-1 bg-muted rounded">npx ignix add &lt;component-name&gt;</code></li>
              <li>Explore themes: <code className="px-2 py-1 bg-muted rounded">npx ignix themes list</code></li>
              <li>Start developing: <code className="px-2 py-1 bg-muted rounded">npm run dev</code></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
`;
  await fs.writeFile(path.join(appDir, 'page.tsx'), page);

  // Create favicon.ico placeholder (empty file)
  await fs.writeFile(path.join(appDir, 'favicon.icon'), '');
}

// 10. Create src directory structure
export async function createSrcDirectory(root: string): Promise<void> {
  // Create pages directory
  await fs.ensureDir(path.join(root, 'src', 'pages'));

  // Create components directory
  await fs.ensureDir(path.join(root, 'src', 'components', 'ui'));

  // Create a sample component
  const sampleComponent = `export function SampleComponent() {
  return (
    <div className="p-4 border border-border rounded-lg">
      <p>Sample Component</p>
    </div>
  );
}
`;
  await fs.writeFile(path.join(root, 'src', 'components', 'SampleComponent.tsx'), sampleComponent);

  // Create styles directory
  await fs.ensureDir(path.join(root, 'src', 'styles'));
}

// 11. Create global styles
export async function createGlobalStyles(root: string): Promise<void> {
  const globalsCss = `@import "tailwindcss";
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
  await fs.writeFile(path.join(root, 'src', 'styles', 'globals.css'), globalsCss);
}

// 12. Create Ignix config
export async function createIgnixConfig(root: string): Promise<void> {
  const ignixConfig = `/* eslint-env node */
/** @type {import('@mindfiredigital/ignix-cli').IgnixConfig} */
module.exports = {
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
  const gitignore = `# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.idea
.vscode
*.swp
*.swo
*~
`;
  await fs.writeFile(path.join(root, '.gitignore'), gitignore);
}

// 13.5 Create the cn() helper - clsx/tailwind-merge are already installed as
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

// 14. Create README.md
export async function createReadme(root: string): Promise<void> {
  const readme = `# Ignix UI Next.js App

A Next.js 14+ starter template with App Router, TypeScript, Tailwind CSS, and Ignix UI.

## Features

- ✅ Next.js 14+ with App Router
- ✅ TypeScript pre-configured
- ✅ Tailwind CSS with Ignix UI integration
- ✅ ThemeProvider setup with theme switching
- ✅ ESLint configuration
- ✅ Prettier formatting
- ✅ Git initialized
- ✅ Hot Module Replacement (HMR)
- ✅ Optimized for performance

## Getting Started

### Development

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

\`\`\`bash
npm run build
npm run start
\`\`\`

## Project Structure

\`\`\`
.
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout with ThemeProvider
│   │   ├── page.tsx      # Home page
│   │   └── providers.tsx # Client component wrapper for ThemeProvider
│   ├── components/       # React components
│   │   └── ui/           # Ignix UI components (generated by CLI)
│   ├── pages/            # Additional pages (optional)
│   └── styles/           # Global styles
│       └── globals.css   # Tailwind CSS imports and theme variables
├── ignix.config.js       # Ignix UI configuration
├── next.config.js        # Next.js configuration
└── tsconfig.json         # TypeScript configuration
\`\`\`

## Adding Components

Use the Ignix UI CLI to add components:

\`\`\`bash
npx ignix add <component-name>
\`\`\`

For example:

\`\`\`bash
npx ignix add button
npx ignix add card
npx ignix add dialog
\`\`\`

## Theming

The app comes with ThemeProvider pre-configured. To explore themes:

\`\`\`bash
npx ignix themes list
\`\`\`

To install a theme:

\`\`\`bash
npx ignix themes install <theme-id>
\`\`\`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Ignix UI Documentation](https://mindfiredigital.github.io/ignix-ui)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
`;
  await fs.writeFile(path.join(root, 'README.md'), readme);
}
