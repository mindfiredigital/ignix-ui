import { getPackageManager } from '../utils/getPackageManager';
import { logger } from '../utils/logger';

const execa = async (...args: any[]): Promise<any> => {
  const { execa: execaImport } = await import('execa');
  return (execaImport as any)(...args);
};

export class DependencyService {
  public async install(
    packages: string[],
    isDev: boolean,
    silent = false,
    cwd?: string
  ): Promise<void> {
    if (packages.length === 0) return;

    const packageManager = await getPackageManager();

    const args: string[] = [];

    // npm uses 'install', while yarn and pnpm use 'add'
    if (packageManager === 'npm') {
      args.push('install');
      if (isDev) {
        args.push('--save-dev');
      }
    } else {
      args.push('add');
      if (isDev) {
        args.push('-D');
      }
    }

    args.push(...packages);

    try {
      if (!silent) {
        logger.info(`Installing dependencies: ${packageManager} ${args.join(' ')}`);
      }
      await execa(packageManager, args, {
        // Capture output even when silent, so the real failure reason is never lost -
        // 'ignore' would discard it entirely, leaving only a generic error message.
        stdio: silent ? 'pipe' : 'inherit',
        // Install into the actual package that needs these deps, not wherever the
        // command happened to be invoked from - matters for monorepos, where that's
        // the workspace root, and package managers like pnpm refuse to add
        // dependencies there directly.
        cwd: cwd ?? process.cwd(),
      });
      if (!silent) {
        logger.success(`Successfully installed: ${packages.join(', ')}`);
      }
    } catch (error) {
      const reason =
        error && typeof error === 'object' && 'stderr' in error && (error as any).stderr
          ? String((error as any).stderr).trim()
          : error instanceof Error
          ? error.message
          : String(error);

      if (!silent) {
        logger.error(error as string);
      }
      throw new Error(`Failed to install dependencies: ${packages.join(', ')} - ${reason}`);
    }
  }
}
