import execa from 'execa'; // Using execa for better process management
import { getPackageManager } from '../utils/getPackageManager';
import { logger } from '../utils/logger';

export class DependencyService {
  public async install(packages: string[], isDev: boolean): Promise<void> {
    if (packages.length === 0) return;

    const packageManager = await getPackageManager();

    const args: string[] = ['add'];
    if (isDev) {
      args.push(packageManager === 'npm' ? '--save-dev' : '-D');
    }

    args.push(...packages);

    try {
      logger.info(
        `Installing dependencies: ${packageManager} ${args.join(' ')} { stdio: 'inherit' }`
      );
      await execa(packageManager, args, { stdio: 'inherit' });
    } catch (error) {
      logger.error(error as string);
      throw new Error(`Failed to install dependencies: ${packages.join(', ')}`);
    }
  }
}
