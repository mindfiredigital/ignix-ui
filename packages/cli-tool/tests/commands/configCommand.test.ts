import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import { logger } from '../../src/utils/logger';

// Mock fs-extra
vi.mock('fs-extra', () => ({
  default: {
    pathExists: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    remove: vi.fn(),
  },
  pathExists: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
  remove: vi.fn(),
}));

let exitCode: number | undefined;

describe('loadConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    exitCode = undefined;

    vi.spyOn(process, 'exit').mockImplementation((code?: any) => {
      exitCode = Number(code) ?? 0;
      throw new Error(`process.exit(${exitCode})`);
    });
    vi.spyOn(console, 'log').mockImplementation(() => vi.fn());
    vi.spyOn(console, 'error').mockImplementation(() => vi.fn());
    vi.spyOn(logger, 'info').mockImplementation(() => vi.fn());
    vi.spyOn(logger, 'warn').mockImplementation(() => vi.fn());
    vi.spyOn(logger, 'error').mockImplementation(() => vi.fn());
    vi.spyOn(logger, 'success').mockImplementation(() => vi.fn());
    vi.spyOn(logger, 'setSilent').mockImplementation(() => vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('throws error when ignix.config.js does not exist', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(false as never);

    const { loadConfig } = await import('../../src/utils/config');

    await expect(loadConfig()).rejects.toThrow(
      "Configuration file `ignix.config.js` not found. Run 'npx ignix init' to create one."
    );
  });

  it('parses JSON config content correctly', async () => {
    const mockConfig = {
      registryUrl: 'https://example.com/registry.json',
      themeUrl: 'https://example.com/themes.json',
      componentsDir: 'src/components/ui',
      themesDir: 'src/themes',
      templateLayoutUrl: 'https://example.com/templates.json',
      templateLayoutDir: 'src/templates',
    };

    vi.mocked(fs.pathExists).mockResolvedValue(true as never);
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockConfig) as never);

    const { loadConfig } = await import('../../src/utils/config');
    const result = await loadConfig();

    expect(result).toEqual(mockConfig);
  });

  it('throws error when config file has invalid content', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true as never);
    vi.mocked(fs.readFile).mockResolvedValue('this is not valid JS or JSON {{{{' as never);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined as never);
    vi.mocked(fs.remove).mockResolvedValue(undefined as never);

    const { loadConfig } = await import('../../src/utils/config');

    await expect(loadConfig()).rejects.toThrow('Failed to load `ignix.config.js`.');
  });
});
