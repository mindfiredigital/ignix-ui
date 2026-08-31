import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import fs from 'fs-extra';
import { ComponentService } from '../../src/services/ComponentService';
import { RegistryService } from '../../src/services/RegistryService';
import { DependencyService } from '../../src/services/DependencyService';
import { loadConfig } from '../../src/utils/config';

vi.mock('axios');
vi.mock('fs-extra');
vi.mock('../../src/utils/config');
vi.mock('../../src/services/RegistryService');
vi.mock('../../src/services/DependencyService');

const mockConfig = {
  registryUrl: 'https://example.com/registry.json',
  componentsDir: 'src/components/ui',
};

const mockComponentConfig = {
  id: 'button',
  name: 'Button',
  dependencies: ['lucide-react'],
  componentDependencies: ['ripple'],
  files: {
    main: { path: 'components/button.tsx', type: 'component' },
  },
};

const mockRippleConfig = {
  id: 'ripple',
  name: 'Ripple',
  files: {
    main: { path: 'components/ripple.tsx', type: 'component' },
  },
};

describe('ComponentService', () => {
  let service: ComponentService;
  let mockRegistry: any;
  let mockDependency: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadConfig).mockResolvedValue(mockConfig as any);

    service = new ComponentService();

    // Get the mocked instances
    mockRegistry = vi.mocked(RegistryService).mock.instances[0];
    mockDependency = vi.mocked(DependencyService).mock.instances[0];
  });

  describe('install', () => {
    it('successfully installs a component and its dependencies', async () => {
      // Mock registry service results
      mockRegistry.getComponentConfig.mockImplementation((name: string) => {
        if (name === 'button') return Promise.resolve(mockComponentConfig);
        if (name === 'ripple') return Promise.resolve(mockRippleConfig);
        return Promise.resolve(undefined);
      });

      // Mock axios for file fetching
      vi.mocked(axios.get).mockResolvedValue({ data: 'component content' });
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined as never);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined as never);

      const result = await service.install('button');

      // Check dependency installation
      expect(mockDependency.install).toHaveBeenCalledWith(
        ['lucide-react'],
        false,
        false,
        expect.any(String)
      );

      // Check recursive component installation
      expect(mockRegistry.getComponentConfig).toHaveBeenCalledWith('button');
      expect(mockRegistry.getComponentConfig).toHaveBeenCalledWith('ripple');
      expect(result.has('button')).toBe(true);
      expect(result.has('ripple')).toBe(true);

      // Check file writing
      expect(fs.writeFile).toHaveBeenCalled();
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('components/button.tsx'),
        expect.anything()
      );
    });

    it('throws error if component not found in registry', async () => {
      mockRegistry.getComponentConfig.mockResolvedValue(undefined);
      await expect(service.install('unknown')).rejects.toThrow("Component 'unknown' not found.");
    });
  });
});
