import axios from 'axios';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { RegistryService } from './RegistryService';
import { loadConfig } from '../utils/config';
import { logger } from '../utils/logger';
import { DependencyService } from './DependencyService';
import { findPackageRoot } from '../utils/findPackageRoot';
import { rewriteCnImportDepth } from '../utils/rewriteCnImportDepth';
import { resolveCnImportPath } from '../utils/resolveCnImportPath';

export class ComponentService {
  private registryService = new RegistryService();
  private dependencyService = new DependencyService();

  private async getConfig(): Promise<ReturnType<typeof loadConfig>> {
    return await loadConfig();
  }

  private silent = false;
  public setSilent(value: boolean): void {
    this.silent = value;
    this.registryService.setSilent(value);
  }

  public async install(name: string, collected = new Set<string>()): Promise<Set<string>> {
    collected.add(name);
    const noop = (): void => {
      return;
    };

    const spinner = this.silent
      ? { start: noop, succeed: noop, fail: noop, text: '' }
      : ora(`Installing component: ${name}...`).start();

    try {
      const config = await this.getConfig();
      const componentConfig = await this.registryService.getComponentConfig(name);

      if (!componentConfig) {
        throw new Error(`Component '${name}' not found.`);
      }

      // 1. Install dependencies
      if (componentConfig.dependencies && componentConfig.dependencies.length > 0) {
        spinner.text = `Installing dependencies for ${name}...`;
        // Resolve the actual workspace package this component belongs to - for a
        // monorepo this is packages/ui, not the repo root.
        const installTargetDir = await findPackageRoot(
          path.resolve(config.componentsDir || 'src/components/ui')
        );
        await this.dependencyService.install(
          componentConfig.dependencies,
          false,
          this.silent,
          installTargetDir
        );
      }

      // 1.a To Install internal component dependencies
      if (
        componentConfig.componentDependencies &&
        componentConfig.componentDependencies?.length > 0
      ) {
        spinner.text = `Installing internal component dependencies...`;

        // for (const dep of componentConfig.componentDependencies) {
        //   await this.install(dep);
        // }
        for (const dep of componentConfig.componentDependencies) {
          if (!collected.has(dep)) {
            await this.install(dep, collected);
          }
        }
      }

      // 2. Fetch and write files
      spinner.text = `Getting component files for ${name}...`;
      if (!config.registryUrl) {
        throw new Error('Registry URL not found in config. Please check your `ignix.config.js`.');
      }
      const registryBaseUrl = config.registryUrl.substring(0, config.registryUrl.lastIndexOf('/'));
      const installedFiles: string[] = [];

      const componentsDir = path.resolve(config.componentsDir || 'src/components/ui');
      // Name the installed folder after the registry's actual source folder (e.g.
      // "date-picker"), not the lowercased registry key (e.g. "datepicker" from
      // "datePicker") - other components/templates already import this one via
      // @ignix-ui/<source-folder-name>, since that's what resolves correctly in the
      // registry's own source tree (and its test suite). Matching that convention on
      // install means those existing imports resolve correctly with zero source edits.
      const installFolderName = componentConfig.files.main
        ? path.basename(path.dirname(componentConfig.files.main.path))
        : name.toLowerCase();
      const componentDir = path.join(componentsDir, installFolderName);
      const cnImportPath = resolveCnImportPath(componentsDir, installFolderName);

      // Create component directory
      await fs.ensureDir(componentDir);

      // Fetch and write each file
      for (const fileKey in componentConfig.files) {
        const fileInfo = componentConfig.files[fileKey];
        if (!fileInfo || !fileInfo.path) {
          logger.warn(`[Component] Missing file info for ${fileKey} in component ${name}`);
          continue;
        }

        const fileUrl = `${registryBaseUrl}/${fileInfo.path}`;
        logger.info(`[Component] Downloading: ${fileUrl}`);

        const { data: rawContent } = await axios.get(fileUrl, { responseType: 'text' });
        // The registry's own source tree needs a deeper relative path to reach its
        // utils/cn.ts than an installed, flattened project does - rewrite it here at
        // install time rather than in the source file, so the registry's own test
        // suite (which resolves the un-rewritten path) is unaffected.
        const content = rewriteCnImportDepth(rawContent, cnImportPath);

        // Use path.basename to handle nested file structures within the component folder
        const fileName = path.basename(fileInfo.path);
        const filePath = path.join(componentDir, fileName);

        await fs.writeFile(filePath, content);
        installedFiles.push(filePath);
        logger.info(`[Component] Saved: ${filePath}`);
      }

      if (!this.silent) {
        spinner.succeed(chalk.green(`Successfully installed component: ${chalk.cyan(name)}`));
        logger.info(`Component files written to ${chalk.yellow(componentDir)}`);
      }
    } catch (error) {
      if (!this.silent) {
        spinner.fail(`Failed to install component: ${name}.`);
        if (error instanceof Error) {
          logger.error(`[Component] Error: ${error.message}`);
          if (process.env.DEBUG === 'true') {
            logger.error(`[Component] Stack: ${error.stack}`);
          }
        }
      }

      throw error;
    }
    return collected;
  }
}
