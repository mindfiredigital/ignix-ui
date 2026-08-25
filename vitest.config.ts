import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    testTimeout: 15000,
    reporters: ['default', ['vitest-sonar-reporter', { outputFile: 'test-report.xml' }]],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
    },
  },
  resolve: {
    alias: {
      '@ignix-ui': path.resolve(__dirname, 'packages/registry/components'),
    },
  },
});
