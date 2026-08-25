// packages/cli-tool/src/utils/rewriteCnImportDepth.ts

/**
 * Rewrites any relative import of utils/cn to whatever depth the actual installed
 * location needs. The registry's own source tree nests components/templates a
 * different number of folders deep than an installed project does (and components vs.
 * templates don't even match each other - componentsDir defaults to the two-segment
 * 'src/components/ui', templateLayoutDir to the one-segment 'src/templates') - so there
 * is no single correct hardcoded depth. This rewrite only applies to the copy written
 * into a consumer's project, never to the source file itself.
 *
 * @param relativeCnImportPath the correct relative import string for this specific
 *   install location, e.g. '../../../utils/cn' for a component in src/components/ui/<name>/.
 */
export function rewriteCnImportDepth(content: string, relativeCnImportPath: string): string {
  return content.replace(/(from\s+['"])(?:\.\.\/)+utils\/cn(['"])/g, `$1${relativeCnImportPath}$2`);
}
