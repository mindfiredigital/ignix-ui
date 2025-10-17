import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: true,
  clean: true,
  target: 'node16',
  tsconfig: './tsconfig.json',
  splitting: false,
  sourcemap: false,
  minify: true,
  treeshake: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  outDir: 'dist',
  esbuildOptions(options) {
    options.platform = 'node';
  },
  // Copy templates directory to dist
  async onSuccess() {
    const { copy } = await import('fs-extra');
    await copy('templates', 'dist/templates');
  },
});
