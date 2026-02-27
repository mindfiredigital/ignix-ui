import axios from 'axios';
import ora from 'ora';
import { loadConfig } from '../utils/config';
import { logger } from '../utils/logger';

// Define types based on your registry.json structure
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
  private silent = false;
  public setSilent(value: boolean): void {
    this.silent = value;
  }

  //------------------------------------------------------------
  // Fetch Component Registry
  //------------------------------------------------------------
  private async fetchRegistry(): Promise<ComponentRegistry> {
    if (this.componentRegistry) return this.componentRegistry;

    const config = await loadConfig();
    const noop = (): void => {
      return;
    };

    const spinner = this.silent
      ? { start: noop, succeed: noop, fail: noop, text: '' }
      : ora('Fetching registry...').start();

    try {
      const response = await axios.get<ComponentRegistry>(config.registryUrl);
      if (!this.silent) {
        spinner.succeed('Component registry fetched.');
      }
      this.componentRegistry = response.data;
      return this.componentRegistry;
    } catch (error) {
      if (!this.silent) {
        spinner.fail('Failed to fetch registry.');
        logger.error('Could not connect to the component registry. Please check your connection.');
      }
      throw new Error('Failed to fetch component registry');
    }
  }

  //------------------------------------------------------------
  // Fetch Template Registry
  //------------------------------------------------------------
  private async fetchAvailableTemplate(): Promise<ComponentRegistry> {
    if (this.componentRegistry) return this.componentRegistry;

    const config = await loadConfig();
    const noop = (): void => {
      return;
    };

    const spinner = this.silent
      ? { start: noop, succeed: noop, fail: noop, text: '' }
      : ora('Fetching Template Layout...').start();

    try {
      const response = await axios.get<ComponentRegistry>(config.templateLayoutUrl);
      if (!this.silent) {
        spinner.succeed('Template layout fetched.');
      }
      this.componentRegistry = response.data;
      return this.componentRegistry;
    } catch (error) {
      if (!this.silent) {
        spinner.fail('Failed to fetch template layout.');
        logger.error('Could not connect to the template registry. Please check your connection.');
      }
      throw new Error('Failed to fetch template registry');
    }
  }

  //------------------------------------------------------------
  // GET template config by name
  //------------------------------------------------------------
  public async getTemplateConfig(name: string): Promise<ComponentConfig | undefined> {
    const registry = await this.fetchAvailableTemplate();
    return registry.components[name];
  }

  //------------------------------------------------------------
  // LIST: All templates
  //------------------------------------------------------------
  public async getAvailableTemplates(): Promise<ComponentConfig[]> {
    const registry = await this.fetchAvailableTemplate();
    return Object.values(registry.components);
  }

  //------------------------------------------------------------
  // GET component config
  //------------------------------------------------------------
  public async getComponentConfig(name: string): Promise<ComponentConfig | undefined> {
    const registry = await this.fetchRegistry();
    return Object.values(registry.components).find(
      (component: any) => component.name.toLowerCase() === name.toLowerCase()
    );
  }

  //------------------------------------------------------------
  // LIST: All components
  //------------------------------------------------------------
  public async getAvailableComponents(): Promise<ComponentConfig[]> {
    const registry = await this.fetchRegistry();
    return Object.values(registry.components);
  }
}
