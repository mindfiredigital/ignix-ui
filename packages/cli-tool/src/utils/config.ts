import path from 'path';
import fs from 'fs-extra';
import { logger } from './logger';

const DEFAULT_CONFIG_FILENAME = 'ignix.config.js';

export interface IgnixConfig {
  registryUrl: string;
  themeUrl: string;
  templateUrl?: string;
  templateLayoutUrl?: string;
  componentsDir: string;
  themesDir: string;
  templatesDir?: string;
  templateLayoutDir?: string;
  globalCss?: string;
}

export async function loadConfig(): Promise<IgnixConfig> {
  const configPath = path.resolve(process.cwd(), DEFAULT_CONFIG_FILENAME);
  if (!(await fs.pathExists(configPath))) {
    // Throw instead of calling process.exit() directly - the caller's own try/catch
    // already builds a proper JSON error response, and a direct exit() here would
    // bypass that entirely, producing no output at all in --json mode.
    throw new Error(
      "Configuration file `ignix.config.js` not found. Run 'npx ignix init' to create one."
    );
  }

  try {
    // Read the file as text first
    const fileContent = await fs.readFile(configPath, 'utf-8');

    // Try to parse as JSON first (in case it's a .json file)
    try {
      return JSON.parse(fileContent);
    } catch (e) {
      // Not a JSON file, continue with JS parsing
    }

    // Check if it's an ES module
    const isESM = fileContent.includes('export default') || fileContent.includes('export const');

    if (isESM) {
      // For ESM, use dynamic import with file URL
      const fileUrl = `file://${configPath}?t=${Date.now()}`;
      const module = await import(fileUrl);
      const config = module.default || module;

      // Handle case where config is nested under 'config' property
      const finalConfig = config && config.config && !config.registryUrl ? config.config : config;

      if (!finalConfig.registryUrl) {
        logger.warn('registryUrl not found in config. Please check your `ignix.config.js`.');
      }

      return finalConfig;
    } else {
      // For CommonJS, create a temporary file with proper exports
      const tempFile = path.join(path.dirname(configPath), `temp-config-${Date.now()}.cjs`);
      try {
        // Wrap the config in a CommonJS module
        await fs.writeFile(
          tempFile,
          `module.exports = ${fileContent
            .trim()
            .replace(/^module\.exports\s*=\s*|\s*;?\s*$/g, '')};`
        );
        // Use dynamic import for better compatibility
        const module = await import(`file://${tempFile}?t=${Date.now()}`);
        const config = module.default || module;

        // Handle case where config is nested under 'config' property
        const finalConfig = config && config.config && !config.registryUrl ? config.config : config;

        // Clean up the temporary file
        await fs.remove(tempFile).catch((e) => {
          logger.warn(`Failed to remove temporary file: ${e}`);
        });

        if (!finalConfig.registryUrl) {
          logger.warn('registryUrl not found in config. Please check your `ignix.config.js`.');
        }

        return finalConfig;
      } catch (e) {
        // Clean up the temporary file if it exists
        await fs.remove(tempFile).catch((e) => {
          logger.warn(`Failed to remove temporary file: ${e}`);
        });
        throw e;
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to load \`${DEFAULT_CONFIG_FILENAME}\`. Error: ${errorMessage}`);
  }
}
