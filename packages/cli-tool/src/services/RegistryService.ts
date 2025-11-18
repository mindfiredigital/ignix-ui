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
  files: Record<string, ComponentFile>;
}

interface ComponentRegistry {
  components: Record<string, ComponentConfig>;
}

// Template registry matches your JSON exactly:
interface TemplateRegistry {
  templates: Record<string, ComponentConfig>;
}

export class RegistryService {
  private componentRegistry: ComponentRegistry | null = null;
  private templateRegistry: TemplateRegistry | null = null;

  //------------------------------------------------------------
  // Fetch Component Registry
  //------------------------------------------------------------
  private async fetchRegistry(): Promise<ComponentRegistry> {
    if (this.componentRegistry) return this.componentRegistry;

    const config = await loadConfig();
    const spinner = ora('Fetching registry...').start();

    try {
      const response = await axios.get<ComponentRegistry>(config.registryUrl);
      spinner.succeed('Component registry fetched.');
      this.componentRegistry = response.data;
      return this.componentRegistry;
    } catch (error) {
      spinner.fail('Failed to fetch registry.');
      logger.error('Could not connect to the component registry. Please check your connection.');
      process.exit(1);
    }
  }

  //------------------------------------------------------------
  // Fetch Template Registry
  //------------------------------------------------------------
  private async fetchAvailableTemplate(): Promise<TemplateRegistry> {
    if (this.templateRegistry) return this.templateRegistry;

    const config = await loadConfig();
    const spinner = ora('Fetching Template Layout...').start();

    try {
      const response = await axios.get<TemplateRegistry>(config.templateLayoutUrl);
      spinner.succeed('Template layout fetched.');
      this.templateRegistry = response.data;
      return this.templateRegistry;
    } catch (error) {
      spinner.fail('Failed to fetch template layout.');
      logger.error('Could not connect to the template registry. Please check your connection.');
      process.exit(1);
    }
  }

  //------------------------------------------------------------
  // GET template config by name
  //------------------------------------------------------------
  public async getTemplateConfig(name: string): Promise<ComponentConfig | undefined> {
    const registry = await this.fetchAvailableTemplate();
    return registry.templates[name];
  }

  //------------------------------------------------------------
  // LIST: All templates
  //------------------------------------------------------------
  public async getAvailableTemplates(): Promise<ComponentConfig[]> {
    const registry = await this.fetchAvailableTemplate();
    return Object.values(registry.templates);
  }

  //------------------------------------------------------------
  // GET component config
  //------------------------------------------------------------
  public async getComponentConfig(name: string): Promise<ComponentConfig | undefined> {
    const registry = await this.fetchRegistry();
    return registry.components[name];
  }

  //------------------------------------------------------------
  // LIST: All components
  //------------------------------------------------------------
  public async getAvailableComponents(): Promise<ComponentConfig[]> {
    const registry = await this.fetchRegistry();
    return Object.values(registry.components);
  }
}
