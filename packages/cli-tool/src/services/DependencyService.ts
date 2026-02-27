import { getPackageManager } from '../utils/getPackageManager';
import { logger } from '../utils/logger';

const run = async (command: string, args: readonly string[], cwd: string) => {
  const { execa } = await import('execa');
  return execa(command, args, { stdio: 'inherit', cwd });
};

export class DependencyService {
  public async install(packages: string[], isDev: boolean): Promise<void> {
    if (!packages.length) return;

    const pm = await getPackageManager();
    let args: string[] = [];

    if (pm === 'npm') {
      args = ['install', ...packages];
      if (isDev) args.push('--save-dev');
    } else {
      args = ['add', ...packages];
      if (isDev) args.push('-D');
    }

    try {
      logger.info(`Installing dependencies: ${pm} ${args.join(' ')}`);
      await run(pm, args, process.cwd());
      logger.success(`Installed: ${packages.join(', ')}`);
    } catch (err) {
      if (pm === 'npm') {
        logger.warn('Retrying with --legacy-peer-deps...');
        await run('npm', ['install', ...packages, '--legacy-peer-deps'], process.cwd());
        logger.success(`Installed with fallback`);
        return;
      }

      logger.error(String(err));
      throw new Error(`Failed to install dependencies: ${packages.join(', ')}`);
    }
  }
}
