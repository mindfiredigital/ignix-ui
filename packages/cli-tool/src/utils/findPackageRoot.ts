// packages/cli-tool/src/utils/findPackageRoot.ts
import path from 'path';
import fs from 'fs-extra';

/**
 * Walks up from `startDir` to find the nearest directory containing a package.json.
 * For a single-package project this resolves to the project root (unchanged
 * behavior). For a monorepo, where componentsDir/templateLayoutDir point inside a
 * workspace package (e.g. packages/ui/src/...), this resolves to that package's own
 * root - which is where its dependencies actually need to be installed, not the
 * monorepo root.
 */
export async function findPackageRoot(startDir: string): Promise<string> {
  let dir = path.resolve(startDir);
  let parent = '';
  while (dir !== parent) {
    if (await fs.pathExists(path.join(dir, 'package.json'))) {
      return dir;
    }

    parent = dir;
    dir = path.dirname(dir);
  }

  return path.resolve(startDir);
}
