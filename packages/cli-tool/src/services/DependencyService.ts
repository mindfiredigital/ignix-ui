import { getPackageManager } from '../utils/getPackageManager';
import { logger } from '../utils/logger';

const execa = async (...args: any[]): Promise<any> => {
  const { execa: execaImport } = await import('execa');
  return (execaImport as any)(...args);
};

export class DependencyService {
  public async install(packages: string[], isDev: boolean): Promise<void> {
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
      logger.info(`Installing dependencies: ${packageManager} ${args.join(' ')}`);
      await execa(packageManager, args, { stdio: 'inherit', cwd: process.cwd() });
      logger.success(`Successfully installed: ${packages.join(', ')}`);
    } catch (error) {
      logger.error(error as string);
      throw new Error(`Failed to install dependencies: ${packages.join(', ')}`);
    }
  }
}
