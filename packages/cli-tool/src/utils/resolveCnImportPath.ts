// packages/cli-tool/src/utils/resolveCnImportPath.ts
import path from 'path';

/**
 * Computes the correct relative import string from an installed component/template
 * directory back to its project's utils/cn.ts, given only the absolute path to
 * componentsDir/templateLayoutDir (there is no separate "utilsDir" config field -
 * cn.ts is always created at the same "src" root as those directories, by convention,
 * e.g. src/components/ui + src/utils, or packages/ui/src/components/ui +
 * packages/ui/src/utils for a monorepo).
 */
export function resolveCnImportPath(baseDir: string, installFolderName: string): string {
  const installDir = path.join(baseDir, installFolderName);

  const segments = baseDir.split(path.sep);
  const srcIndex = segments.lastIndexOf('src');
  const projectSrcRoot =
    srcIndex !== -1 ? segments.slice(0, srcIndex + 1).join(path.sep) : path.dirname(baseDir);

  const utilsCnPath = path.join(projectSrcRoot, 'utils', 'cn');
  const relative = path.relative(installDir, utilsCnPath).split(path.sep).join('/');
  return relative.startsWith('.') ? relative : `./${relative}`;
}
