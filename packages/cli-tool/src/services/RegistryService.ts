import axios from 'axios';
import ora from 'ora';
import { loadConfig } from '../utils/config';
import { logger } from '../utils/logger';

interface ComponentFile {
  path: string;
  type: string;
}

interface ComponentConfig {
  id?: string;
  name: string;
  description: string;
  dependencies?: string[];
  componentDependencies?: string[];
  files: Record<string, ComponentFile>;
}

interface ComponentRegistry {
  components: Record<string, ComponentConfig>;
}

export class RegistryService {
  private componentRegistry: ComponentRegistry | null = null;
  private templateRegistry: ComponentRegistry | null = null;

  private silent = false;

  public setSilent(value: boolean): void {
    this.silent = value;
  }

  //------------------------------------------------------------
  // COMPONENT REGISTRY
  //------------------------------------------------------------
  private async fetchRegistry(): Promise<ComponentRegistry> {
    if (this.componentRegistry) {
      logger.info('[Registry] Using cached component registry');
      return this.componentRegistry;
    }

    const config = await loadConfig();

    logger.info(`[Registry] Fetching components from: ${config.registryUrl}`);

    let spinner: ReturnType<typeof ora> | null = null;
    if (!this.silent) {
      spinner = ora('Fetching component registry...').start();
    }

    try {
      const response = await axios.get<ComponentRegistry>(config.registryUrl);

      spinner?.succeed('Component registry fetched.');

      logger.info(`[Registry] Components loaded: ${Object.keys(response.data.components).length}`);

      this.componentRegistry = response.data;
      return this.componentRegistry;
    } catch (err) {
      spinner?.fail('Failed to fetch component registry.');

      logger.error('[Registry] Component fetch failed');
      logger.error(`URL: ${config.registryUrl}`);

      if (err instanceof Error) {
        logger.error(`Reason: ${err.message}`);

        if (process.env.DEBUG === 'true') {
          logger.error(`Stack: ${err.stack}`);
        }
      } else {
        logger.error(`Reason: ${String(err)}`);
      }

      throw new Error('Failed to fetch component registry');
    }
  }

  //------------------------------------------------------------
  // PUBLIC METHODS
  //------------------------------------------------------------
  // registry.json keys each entry by its id (e.g. "advanced-search-form"); the value itself
  // has no `id` property. Object.values() alone would discard that key, so every consumer
  // needs entries with `id` attached from the map key.
  private withIds(registry: ComponentRegistry): ComponentConfig[] {
    return Object.entries(registry.components).map(([key, c]) => ({ ...c, id: c.id || key }));
  }

  public async getTemplateConfig(name: string): Promise<ComponentConfig | undefined> {
    logger.info(`[Registry] Getting template config: ${name}`);

    const registry = await this.fetchRegistry();

    const item = this.withIds(registry).find(
      (c) =>
        ((c.id && String(c.id).toLowerCase() === String(name).toLowerCase()) ||
          (c.name && String(c.name).toLowerCase() === String(name).toLowerCase())) &&
        c.files?.main?.type === 'template'
    );

    if (!item) {
      logger.warn(`[Registry] Template not found: ${name}`);
    }

    return item;
  }

  public async getAvailableTemplates(): Promise<ComponentConfig[]> {
    const registry = await this.fetchRegistry();

    return this.withIds(registry).filter((c) => c.files?.main?.type === 'template');
  }

  public async getComponentConfig(name: string): Promise<ComponentConfig | undefined> {
    logger.info(`[Registry] Getting component config: ${name}`);

    const registry = await this.fetchRegistry();

    return this.withIds(registry).find(
      (c) =>
        (c.name && String(c.name).toLowerCase() === String(name).toLowerCase()) ||
        (c.id && String(c.id).toLowerCase() === String(name).toLowerCase())
    );
  }

  public async getAvailableComponents(): Promise<ComponentConfig[]> {
    const registry = await this.fetchRegistry();
    return this.withIds(registry);
  }
}
