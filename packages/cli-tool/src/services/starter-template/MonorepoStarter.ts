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
      moduleResolution: 'Bundler',
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
    name: '@acme/config',
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
      tailwindcss: '^3.4.0',
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
    `module.exports = { content: ['../../apps/**/*.{ts,tsx}', '../../packages/**/*.{ts,tsx}'], theme: { extend: {} }, plugins: [] };\n`
  );
}

// Helper function to scaffold components package
export async function scaffoldComponentsPackage(root: string) {
  const base = path.join(root, 'packages', 'components');
  await fs.ensureDir(path.join(base, 'src'));

  const pkg = {
    name: '@acme/components',
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
    dependencies: {},
    devDependencies: {
      '@acme/config': 'workspace:*',
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
      extends: '@acme/config/tsconfig/base.json',
      compilerOptions: { outDir: 'dist' },
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

  const tokens = `export const tokens = { colors: { primary: '#4f46e5' } } as const;\n`;
  await fs.writeFile(path.join(base, 'src', 'tokens.ts'), tokens);
  const btn = `import React from 'react';\nexport function Button({ children }: { children: React.ReactNode }) {\n  return <button style={{ padding: '8px 12px' }}>{children}</button>;\n}\n`;
  await fs.writeFile(path.join(base, 'src', 'Button.tsx'), btn);
  const index = `export * from './Button';\nexport * from './tokens';\n`;
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
      '@acme/components': 'workspace:*',
    },
    devDependencies: {
      '@acme/config': 'workspace:*',
      '@types/node': '^20.16.11',
      typescript: '^5.6.0',
    },
  };
  await fs.writeJSON(path.join(base, 'package.json'), pkg, { spaces: 2 });
  await fs.writeJSON(
    path.join(base, 'tsconfig.json'),
    { extends: '@acme/config/tsconfig/base.json', compilerOptions: { jsx: 'react-jsx' } },
    { spaces: 2 }
  );

  const nextConfig = `const nextConfig = {
  experimental: {
    turbo: {},
  },
};

export default nextConfig; `;
  await fs.writeFile(path.join(base, 'next.config.mjs'), nextConfig);

  const page = `import { Button } from '@acme/components/src';\nexport default function Page() {\n  return (<main style={{ padding: 24 }}><h1>Ignix Monorepo</h1><Button>From components pkg</Button></main>);\n}\n`;
  await fs.writeFile(path.join(base, 'app', 'page.tsx'), page);
}
