import { detect } from '@antfu/ni';

export async function getPackageManager(): Promise<'npm' | 'yarn' | 'pnpm' | 'bun'> {
  const detected = await detect({ programmatic: true, cwd: process.cwd() });

  if (detected === 'yarn@berry') return 'yarn';
  if (detected === 'pnpm@6' || detected === 'pnpm') return 'pnpm';

  return detected ?? 'npm';
}
