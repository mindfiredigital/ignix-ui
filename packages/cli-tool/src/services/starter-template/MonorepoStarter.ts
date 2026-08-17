import path from 'path';
import fs from 'fs-extra';

export async function ensureRootFiles(root: string) {
  const pkgPath = path.join(root, 'package.json');
  let pkg: any = {};
  if (await fs.pathExists(pkgPath)) {
    try {
      pkg = await fs.readJSON(pkgPath);
    } catch {
      pkg = {};
    }
  }
  pkg.name = pkg.name || 'ignix-monorepo';
  pkg.private = true;
  pkg.packageManager = pkg.packageManager || 'pnpm@8.15.0';
  pkg.scripts = {
    ...(pkg.scripts || {}),
    build: 'turbo build',
    dev: 'turbo dev',
    lint: 'turbo lint',
    test: 'turbo test',
  };
  pkg.workspaces = pkg.workspaces || ['apps/*', 'packages/*'];
  pkg.devDependencies = {
    ...(pkg.devDependencies || {}),
    turbo: '^2.0.0',
  };
  await fs.writeJSON(pkgPath, pkg, { spaces: 2 });

  const pnpmWorkspace = `packages:\n  - 'apps/*'\n  - 'packages/*'\n`;
  await fs.writeFile(path.join(root, 'pnpm-workspace.yaml'), pnpmWorkspace);

  const turbo = {
    $schema: 'https://turbo.build/schema.json',
    tasks: {
      build: { dependsOn: ['^build'], outputs: ['dist/**', '.next/**'] },
      dev: { cache: false, persistent: true },
      lint: {},
      test: {},
    },
  };
  await fs.writeJSON(path.join(root, 'turbo.json'), turbo, { spaces: 2 });
}

// Helper function to ensure root tsconfig.json
export async function ensureRootTsconfig(root: string) {
  const baseTsconfig = {
    compilerOptions: {
      target: 'ES2021',
      module: 'ESNext',
      moduleResolution: 'bundler',
      strict: true,
      jsx: 'react-jsx',
      resolveJsonModule: true,
      skipLibCheck: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      baseUrl: '.',
      paths: {},
    },
  };
  await fs.writeJSON(path.join(root, 'tsconfig.json'), baseTsconfig, { spaces: 2 });
}

// Helper function to scaffold config package
export async function scaffoldConfigPackage(root: string) {
  const base = path.join(root, 'packages', 'config');
  await fs.ensureDir(base);

  const pkg = {
    name: '@ignix/config',
    version: '0.0.0',
    private: true,
    main: 'eslint/index.cjs',
    files: ['eslint', 'tsconfig', 'tailwind'],
    devDependencies: {
      '@typescript-eslint/eslint-plugin': '^8.0.0',
      '@typescript-eslint/parser': '^8.0.0',
      eslint: '^9.0.0',
      'eslint-config-prettier': '^9.0.0',
      typescript: '^5.6.0',
      tailwindcss: '^4.0.0',
      '@tailwindcss/postcss': '^4.0.0',
    },
  };
  await fs.writeJSON(path.join(base, 'package.json'), pkg, { spaces: 2 });

  const eslintDir = path.join(base, 'eslint');
  await fs.ensureDir(eslintDir);
  await fs.writeFile(
    path.join(eslintDir, 'index.cjs'),
    `module.exports = { extends: ['eslint:recommended'], parser: '@typescript-eslint/parser', plugins: ['@typescript-eslint'] };\n`
  );

  const tsDir = path.join(base, 'tsconfig');
  await fs.ensureDir(tsDir);
  await fs.writeJSON(
    path.join(tsDir, 'base.json'),
    { extends: '../../tsconfig.json', compilerOptions: { composite: true } },
    { spaces: 2 }
  );

  const twDir = path.join(base, 'tailwind');
  await fs.ensureDir(twDir);
  await fs.writeFile(
    path.join(twDir, 'tailwind.config.cjs'),
    `module.exports = { content: ['../../apps/**/*.{ts,tsx}', '../../packages/**/*.{ts,tsx}'] };\n`
  );
}

// Helper function to scaffold UI package
export async function scaffoldUiPackage(root: string) {
  const base = path.join(root, 'packages', 'ui');
  await fs.ensureDir(path.join(base, 'src', 'components', 'ui'));
  await fs.ensureDir(path.join(base, 'src', 'utils'));

  const pkg = {
    name: '@ignix/ui',
    version: '0.0.0',
    private: true,
    type: 'module',
    main: './dist/index.js',
    module: './dist/index.mjs',
    types: './dist/index.d.ts',
    scripts: {
      build: 'tsc -p tsconfig.build.json',
      dev: 'tsc -w -p tsconfig.build.json',
      lint: 'eslint "src/**/*.{ts,tsx}"',
    },
    dependencies: {
      '@mindfiredigital/ignix-ui': '^1.0.5',
      'framer-motion': '^11.0.0',
      'lucide-react': '^0.446.0',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.3.0',
      '@radix-ui/react-slot': '^1.1.0',
      'class-variance-authority': '^0.7.0',
    },
    devDependencies: {
      '@ignix/config': 'workspace:*',
      typescript: '^5.6.0',
      eslint: '^9.0.0',
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0',
    },
    peerDependencies: {
      react: '^18 || ^19',
      'react-dom': '^18 || ^19',
    },
  };
  await fs.writeJSON(path.join(base, 'package.json'), pkg, { spaces: 2 });

  await fs.writeJSON(
    path.join(base, 'tsconfig.json'),
    {
      extends: '@ignix/config/tsconfig/base.json',
      compilerOptions: {
        outDir: 'dist',
        baseUrl: '.',
        paths: {
          '@ignix-ui/*': ['./src/components/ui/*', './src/components/templates/*'],
        },
      },
      include: ['src'],
    },
    { spaces: 2 }
  );
  await fs.writeJSON(
    path.join(base, 'tsconfig.build.json'),
    {
      extends: './tsconfig.json',
      compilerOptions: { declaration: true, emitDeclarationOnly: false },
    },
    { spaces: 2 }
  );

  // 1. Create cn utility
  const cnTs = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  await fs.writeFile(path.join(base, 'src', 'utils', 'cn.ts'), cnTs);

  // 2. Create official Button component
  const buttonTsx = `'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag'>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animationVariant?: string;
  children?: React.ReactNode;
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'px-4 py-2 bg-primary text-white hover:bg-primary/90',
        primary: 'px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90',
        secondary: 'bg-muted text-muted-foreground hover:bg-muted/90',
        success: 'bg-success text-success-foreground hover:bg-success/90',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        subtle: 'bg-accent text-accent-foreground hover:bg-accent/80',
        elevated: 'bg-background shadow-md hover:shadow-lg',
        glass: 'bg-black/10 backdrop-blur-lg text-primary hover:bg-black/20',
        neon: 'bg-pink-500 text-white shadow-lg shadow-pink-500/50 hover:bg-pink-600',
        none: '',
      },
      size: {
        xs: 'h-8 px-2 text-xs rounded-sm',
        sm: 'h-9 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-base rounded-md',
        lg: 'h-12 px-6 text-lg rounded-lg',
        xl: 'h-14 px-8 text-xl rounded-lg',
        icon: 'h-10 w-10 p-2',
        pill: 'h-10 px-6 text-base rounded-full',
        block: 'w-full py-3 text-lg',
        compact: 'h-8 px-2 text-xs',
        wide: 'px-12 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const animations = {
  bounce: {
    animate: { y: [0, -10, 0] },
    transition: { repeat: Infinity, duration: 0.5 },
  },
  scalePulse: {
    animate: { scale: [1, 1.1, 1] },
    transition: { repeat: Infinity, duration: 0.6 },
  },
  press3D: {
    whileTap: { scale: 0.9, y: 5 },
    transition: { duration: 0.1 },
  },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, animationVariant, children, ...props }, ref) => {
    const animationProps = animationVariant ? animations[animationVariant as keyof typeof animations] || {} : {};

    const slotProps = asChild ? { ...props } : {};
    const motionProps = !asChild ? { ...props, ...animationProps } : {};

    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...slotProps}>
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...(motionProps as any)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
`;
  await fs.writeFile(path.join(base, 'src', 'components', 'ui', 'button.tsx'), buttonTsx);

  const index = `export * from './components/ui/button';\nexport * from './utils/cn';\n`;
  await fs.writeFile(path.join(base, 'src', 'index.ts'), index);
}

// tsconfig under packages
export async function ensureTsconfigPackage(root: string) {
  const base = path.join(root, 'packages');
  const baseTsconfig = `{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "emitDeclarationOnly": false,
    "outDir": "dist"
  }
}
`;
  await fs.writeFile(path.join(base, 'tsconfig.json'), baseTsconfig);
}

// Helper function to scaffold Next.js app
export async function scaffoldNextApp(root: string) {
  const base = path.join(root, 'apps', 'web');
  await fs.ensureDir(path.join(base, 'app'));

  const pkg = {
    name: 'web',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      next: '14.2.10',
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      '@ignix/ui': 'workspace:*',
      '@mindfiredigital/ignix-ui': '^1.0.5',
    },
    devDependencies: {
      '@ignix/config': 'workspace:*',
      '@types/node': '^20.16.11',
      typescript: '^5.6.0',
    },
  };
  await fs.writeJSON(path.join(base, 'package.json'), pkg, { spaces: 2 });
  await fs.writeJSON(
    path.join(base, 'tsconfig.json'),
    { extends: '@ignix/config/tsconfig/base.json', compilerOptions: { jsx: 'react-jsx' } },
    { spaces: 2 }
  );

  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {},
  },
};

export default nextConfig; `;
  await fs.writeFile(path.join(base, 'next.config.mjs'), nextConfig);

  // Create Root Layout with ThemeProvider
  const layout = `import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mindfiredigital/ignix-ui';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ignix Monorepo App',
  description: 'Built with Ignix UI',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider enableSystemPreference>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
`;
  await fs.writeFile(path.join(base, 'app', 'layout.tsx'), layout);

  const page = `import { Button } from '@ignix/ui';

export default function Page() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-24 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Ignix <span className="text-primary">Monorepo</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          Your professional design system workspace is ready.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 border border-border rounded-2xl bg-card/50 backdrop-blur-sm">
        <Button variant="default" animationVariant="press3D">
          3D Default
        </Button>
        <Button variant="neon">
          Neon Style
        </Button>
        <Button variant="glass">
          Glassmorphism
        </Button>
        <Button variant="outline" animationVariant="scalePulse">
          Pulsing Outline
        </Button>
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground pt-8">
        <code>packages/ui</code>
        <span>•</span>
        <code>apps/web</code>
      </div>
    </main>
  );
}
`;
  await fs.writeFile(path.join(base, 'app', 'page.tsx'), page);

  const globalsCss = `@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
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
  --primary: var(--ignix-primary, hsl(221.2 83.2% 53.3%));
  --primary-foreground: var(--ignix-text-inverse, hsl(210 40% 98%));
  --card: var(--ignix-surface, hsl(0 0% 100%));
  --card-foreground: var(--ignix-text, hsl(222.2 84% 4.9%));
  --popover: var(--ignix-surface, hsl(0 0% 100%));
  --popover-foreground: var(--ignix-text, hsl(222.2 84% 4.9%));
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
  --ring: var(--ignix-primary, hsl(221.2 83.2% 53.3%));
  --radius: 0.5rem;
}

.dark {
  --background: var(--ignix-background, hsl(222.2 84% 4.9%));
  --foreground: var(--ignix-text, hsl(210 40% 98%));
  --primary: var(--ignix-primary, hsl(217.2 91.2% 59.8%));
  --primary-foreground: var(--ignix-text-inverse, hsl(222.2 47.4% 11.2%));
  --card: var(--ignix-surface, hsl(222.2 84% 4.9%));
  --card-foreground: var(--ignix-text, hsl(210 40% 98%));
  --popover: var(--ignix-surface, hsl(222.2 84% 4.9%));
  --popover-foreground: var(--ignix-text, hsl(210 40% 98%));
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
  --ring: var(--ignix-primary, hsl(224.3 76.3% 48%));
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
  await fs.writeFile(path.join(base, 'app', 'globals.css'), globalsCss);
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

  // Default directory for UI components in a monorepo
  componentsDir: 'packages/ui/src/components/ui',

  // Default directory for themes
  themesDir: 'packages/ui/src/themes',

  // Default directory for templates in a monorepo
  templateLayoutDir: 'packages/ui/src/templates',
};
`;
  await fs.writeFile(path.join(root, 'ignix.config.js'), ignixConfig);
}
