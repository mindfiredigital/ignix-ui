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
  name: string;
  description: string;
  dependencies?: string[];
  files: Record<string, ComponentFile>;
}

interface Registry {
  components: Record<string, ComponentConfig>;
}

export class RegistryService {
  private registry: Registry | null = null;

  private async fetchRegistry(): Promise<Registry> {
    if (this.registry) {
      return this.registry;
    }

    const config = await loadConfig();
    const spinner = ora('Fetching registry...').start();

    try {
      const response = await axios.get<Registry>(config.registryUrl);
      spinner.succeed('Registry fetched.');
      this.registry = response.data;
      return this.registry;
    } catch (error) {
      spinner.fail('Failed to fetch registry.');
      logger.error('Could not connect to the component registry. Please check your connection.');
      process.exit(1);
    }
  }

  public async getComponentConfig(name: string): Promise<ComponentConfig | undefined> {
    const registry = await this.fetchRegistry();
    return registry.components[name];
  }

  public async getAvailableComponents(): Promise<ComponentConfig[]> {
    const registry = await this.fetchRegistry();
    return Object.values(registry.components);
  }
}
