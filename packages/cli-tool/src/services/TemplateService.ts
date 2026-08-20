import axios from 'axios';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { RegistryService } from './RegistryService';
import { loadConfig } from '../utils/config';
import { logger } from '../utils/logger';
import { DependencyService } from './DependencyService';
import { ComponentService } from './ComponentService';
import { findPackageRoot } from '../utils/findPackageRoot';
import { rewriteCnImportDepth } from '../utils/rewriteCnImportDepth';
import { resolveCnImportPath } from '../utils/resolveCnImportPath';

export class TemplateService {
  private registryService = new RegistryService();
  private dependencyService = new DependencyService();
  private componentService = new ComponentService();

  private async getConfig(): Promise<ReturnType<typeof loadConfig>> {
    return await loadConfig();
  }

  private silent = false;

  public setSilent(value: boolean): void {
    this.silent = value;
    this.registryService.setSilent?.(value);
    this.componentService.setSilent?.(value);
  }

  public async install(name: string): Promise<void> {
    let spinner: ReturnType<typeof ora> | null = null;

    if (!this.silent) {
      spinner = ora(`Installing template: ${name}...`).start();
    }

    logger.info(`[Template] Starting install: ${name}`);

    try {
      const config = await this.getConfig();

      const templateConfig = await this.registryService.getTemplateConfig(name);

      if (!templateConfig) {
        throw new Error(`Template '${name}' not found.`);
      }

      logger.info('[Template] Template config loaded');

      // Resolve the actual workspace package these files (and their dependencies)
      // belong to - for a monorepo this is packages/ui, not the repo root.
      const templateLayoutDirForDeps =
        config.templateLayoutDir || config.templatesDir || 'src/templates';
      const installTargetDir = await findPackageRoot(path.resolve(templateLayoutDirForDeps));

      //--------------------------------------------------
      // Dependencies
      //--------------------------------------------------
      if (templateConfig.dependencies?.length) {
        spinner && (spinner.text = 'Installing dependencies...');
        logger.info(`[Template] Installing dependencies into: ${installTargetDir}`);

        await this.dependencyService.install(
          templateConfig.dependencies,
          false,
          this.silent,
          installTargetDir
        );
      }

      //--------------------------------------------------
      // Internal Components
      //--------------------------------------------------
      if (templateConfig.componentDependencies?.length) {
        spinner && (spinner.text = 'Installing internal components...');
        logger.info('[Template] Installing internal components');

        for (const dep of templateConfig.componentDependencies) {
          logger.info(`[Template] Installing component dependency: ${dep}`);
          await this.componentService.install(dep);
        }
      }

      //--------------------------------------------------
      // Files
      //--------------------------------------------------
      spinner && (spinner.text = 'Downloading template files...');

      // Name the installed folder after the registry's actual source folder (e.g.
      // "date-picker"), not the lowercased registry key - other templates/components
      // already import this one via @ignix-ui/<source-folder-name>, since that's what
      // resolves correctly in the registry's own source tree (and its test suite).
      // Matching that convention on install means those existing imports resolve
      // correctly with zero source edits.
      const installFolderName = templateConfig.files.main
        ? path.basename(path.dirname(templateConfig.files.main.path))
        : name.toLowerCase();
      const templateDir = path.resolve(templateLayoutDirForDeps, installFolderName);
      const cnImportPath = resolveCnImportPath(
        path.resolve(templateLayoutDirForDeps),
        installFolderName
      );
      await fs.ensureDir(templateDir);

      let baseUrl = config.templateLayoutUrl || config.templateUrl || '';

      if (!baseUrl) {
        baseUrl = config.registryUrl?.replace('/registry.json', '') || '';
        if (!baseUrl || baseUrl === config.registryUrl) {
          if (!config.registryUrl) {
            throw new Error(
              'Registry URL not found in config. Please check your `ignix.config.js`.'
            );
          }

          const lastSlashIndex = config.registryUrl.lastIndexOf('/');
          baseUrl =
            lastSlashIndex !== -1
              ? config.registryUrl.substring(0, lastSlashIndex)
              : config.registryUrl;
        }
      }

      if (!baseUrl) {
        throw new Error('Invalid download URL in config. Please check your `ignix.config.js`.');
      }
      logger.info(`[Template] Base URL: ${baseUrl}`);

      for (const fileKey in templateConfig.files) {
        const fileInfo = templateConfig.files[fileKey];
        if (!fileInfo || !fileInfo.path) {
          logger.warn(`[Template] Missing file info for ${fileKey} in template ${name}`);
          continue;
        }

        const fileUrl = new URL(fileInfo.path, baseUrl + '/').toString();
        logger.info(`[Template] Downloading: ${fileUrl}`);

        const { data: rawContent } = await axios.get(fileUrl, {
          responseType: 'text',
        });
        // The registry's own source tree needs a deeper relative path to reach its
        // utils/cn.ts than an installed, flattened project does - rewrite it here at
        // install time rather than in the source file, so the registry's own test
        // suite (which resolves the un-rewritten path) is unaffected.
        const content = rewriteCnImportDepth(rawContent, cnImportPath);

        const fileName = path.basename(fileInfo.path);
        const filePath = path.join(templateDir, fileName);

        await fs.writeFile(filePath, content);

        logger.info(`[Template] Saved: ${filePath}`);
      }

      spinner?.succeed(chalk.green(`Template installed: ${name}`));
      logger.info(`[Template] Install complete: ${name}`);
    } catch (err) {
      spinner?.fail(`Failed to install template: ${name}`);

      logger.error('[Template] Install failed');

      if (axios.isAxiosError(err)) {
        logger.error(`[Axios] ${err.message}`);

        if (err.response) {
          logger.error(`Status: ${err.response.status}`);
          logger.error(`URL: ${err.config?.url}`);
        } else if (err.request) {
          logger.error('No response received from server');
        }
      } else if (err instanceof Error) {
        logger.error(`Reason: ${err.message}`);
      } else {
        logger.error(`Reason: ${String(err)}`);
      }

      throw err;
    }
  }
}
