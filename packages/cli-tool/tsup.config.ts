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
  minify: false,
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
    const { copy, pathExists } = await import('fs-extra');
    await copy('templates', 'dist/templates');

    // Bundle the repo-root llms.txt so `ignix llms` works fully offline and
    // always matches the installed CLI version, without duplicating its content.
    const rootLlmsTxt = '../../llms.txt';
    if (await pathExists(rootLlmsTxt)) {
      await copy(rootLlmsTxt, 'dist/llms.txt');
    }
  },
});
