import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
  resolve: {
    alias: {
      '@ignix-ui': path.resolve(__dirname, 'packages/registry/components'),
    },
  },
});
