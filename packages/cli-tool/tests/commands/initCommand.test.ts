import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitCommand } from '../../src/commands/init';
import { loadConfig } from '../../src/utils/config';
import { ThemeService } from '../../src/services/ThemeService';
import { DependencyService } from '../../src/services/DependencyService';
import { logger } from '../../src/utils/logger';
import fs from 'fs-extra';
import prompts from 'prompts';
import { setupTestMocks, resetTestState, runCommand, parseJsonOutput, exitCode } from '../helpers';

// --- Mocks ---
vi.mock('fs-extra');
vi.mock('prompts');
vi.mock('../../src/services/ThemeService');
vi.mock('../../src/services/DependencyService');

vi.mock('../../src/utils/config', () => ({
  loadConfig: vi.fn(),
}));

setupTestMocks();

// Helper to get mock instances
const getThemeServiceMock = () => vi.mocked(ThemeService).mock.results[0]?.value;

beforeEach(() => {
  resetTestState();

  vi.mocked(fs.pathExists).mockResolvedValue(true as never);
  vi.mocked(fs.readFile).mockResolvedValue(
    'module.exports = { componentsDir: "./src/components", themesDir: "./src/themes" };' as never
  );
  vi.mocked(fs.writeFile).mockResolvedValue(undefined as never);
  vi.mocked(fs.copy).mockResolvedValue(undefined as never);
  vi.mocked(fs.ensureDir).mockResolvedValue(undefined as never);
  vi.mocked(fs.remove).mockResolvedValue(undefined as never);

  vi.spyOn(process, 'chdir').mockImplementation(() => vi.fn());

  // Default mock for loadConfig
  vi.mocked(loadConfig).mockResolvedValue({
    componentsDir: './src/components',
    themesDir: './src/themes',
  } as any);

  vi.mocked(ThemeService).mockImplementation(
    () =>
      ({
        getAvailableThemes: vi.fn().mockResolvedValue([]),
        install: vi.fn().mockResolvedValue(undefined),
        setSilent: vi.fn(),
      } as any)
  );

  vi.mocked(DependencyService).mockImplementation(
    () =>
      ({
        install: vi.fn().mockResolvedValue(undefined),
      } as any)
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('init command', () => {
  it('initializes successfully with default settings', async () => {
    vi.mocked(prompts).mockResolvedValue({ setupTheming: false });

    await runCommand(createInitCommand, ['--yes']);

    expect(fs.ensureDir).toHaveBeenCalled();
    expect(exitCode).toBeUndefined(); // Success
  });

  it('fails when package.json is missing', async () => {
    vi.mocked(fs.pathExists).mockImplementation((path: any) => {
      if (path.toString().includes('package.json')) return Promise.resolve(false);
      return Promise.resolve(true);
    });

    await runCommand(createInitCommand, []);
    expect(exitCode).toBe(1);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('No package.json found'));
  });

  it('outputs valid JSON success report', async () => {
    await runCommand(createInitCommand, ['--yes', '--json']);

    const output = parseJsonOutput();
    expect(output.success).toBe(true);
    expect(output.initialized).toBe(true);
  });

  it('outputs JSON error report on failure', async () => {
    vi.mocked(fs.pathExists).mockImplementation((path: any) => {
      if (path.toString().includes('package.json')) return Promise.resolve(false);
      return Promise.resolve(true);
    });

    await runCommand(createInitCommand, ['--json']);

    const output = parseJsonOutput();
    expect(output.success).toBe(false);
    expect(output.error).toContain('package.json');
    expect(exitCode).toBe(1);
  });
});

it('handles theming setup when requested', async () => {
  const mockThemes = [{ id: 'dark', name: 'Dark' }];

  vi.mocked(ThemeService).mockImplementation(
    () =>
      ({
        getAvailableThemes: vi.fn().mockResolvedValue(mockThemes),
        install: vi.fn().mockResolvedValue(undefined),
        setSilent: vi.fn(),
      } as any)
  );

  vi.mocked(prompts)
    .mockResolvedValueOnce({ globalCss: 'src/index.css' })
    .mockResolvedValueOnce({ setupTheming: true })
    .mockResolvedValueOnce({ themeId: 'dark' });

  await runCommand(createInitCommand, []);

  const themeService = getThemeServiceMock();
  expect(themeService).toBeDefined();
  expect(themeService.install).toHaveBeenCalledWith('dark');
});
