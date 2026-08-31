import { logger } from '../src/utils/logger';
import { vi } from 'vitest';
import { Command } from 'commander';

export let exitCode: number | undefined;
export let consoleOutput: string[] = [];

export let chdirSpy: any;
export let exitSpy: any;
export function setupTestMocks() {
  exitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: any) => {
    exitCode = Number(code) ?? 0;
    throw new Error(`process.exit(${exitCode})`);
  });

  vi.spyOn(console, 'log').mockImplementation((...args: any[]) => {
    consoleOutput.push(args.join(' '));
  });

  chdirSpy = vi.spyOn(process, 'chdir').mockImplementation(() => vi.fn());

  vi.spyOn(logger, 'info').mockImplementation(() => vi.fn());
  vi.spyOn(logger, 'warn').mockImplementation(() => vi.fn());
  vi.spyOn(logger, 'error').mockImplementation(() => vi.fn());
  vi.spyOn(logger, 'success').mockImplementation(() => vi.fn());
  vi.spyOn(logger, 'setSilent').mockImplementation(() => vi.fn());
}

export function resetTestState() {
  exitCode = undefined;
  process.exitCode = undefined;
  consoleOutput = [];
  vi.clearAllMocks();
  exitSpy.mockImplementation((code?: any) => {
    exitCode = Number(code) ?? 0;
    throw new Error(`process.exit(${exitCode})`);
  });

  vi.spyOn(console, 'log').mockImplementation((...args: any[]) => {
    consoleOutput.push(args.join(' '));
  });

  vi.spyOn(logger, 'info').mockImplementation(() => vi.fn());
  vi.spyOn(logger, 'warn').mockImplementation(() => vi.fn());
  vi.spyOn(logger, 'error').mockImplementation(() => vi.fn());
  vi.spyOn(logger, 'success').mockImplementation(() => vi.fn());
  vi.spyOn(logger, 'setSilent').mockImplementation(() => vi.fn());
}

export async function runCommand(factory: () => Command, args: string[]) {
  const cmd = factory();
  const program = new Command();
  program.addCommand(cmd);
  program.exitOverride();

  try {
    await program.parseAsync(['node', 'cli', cmd.name(), ...args]);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message && error.message.startsWith('process.exit')) return;
      if (error.name === 'CommanderError') return;
    }
    throw error;
  } finally {
    if (process.exitCode !== undefined) {
      exitCode = process.exitCode;
    }
  }
}

export function parseJsonOutput() {
  const jsonStr = consoleOutput.find((s) => {
    try {
      const trimmed = s.trim();
      if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return false;
      const parsed = JSON.parse(trimmed);
      return parsed && typeof parsed === 'object' && 'success' in parsed;
    } catch {
      return false;
    }
  });

  return JSON.parse(jsonStr || '{}');
}
