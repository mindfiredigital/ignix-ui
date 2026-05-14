import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import fs from 'fs-extra';
import { TemplateService } from '../../src/services/TemplateService';
import { RegistryService } from '../../src/services/RegistryService';
import { DependencyService } from '../../src/services/DependencyService';
import { ComponentService } from '../../src/services/ComponentService';
import { loadConfig } from '../../src/utils/config';

vi.mock('axios');
vi.mock('fs-extra');
vi.mock('../../src/utils/config');
vi.mock('../../src/services/RegistryService');
vi.mock('../../src/services/DependencyService');
vi.mock('../../src/services/ComponentService');

const mockConfig = {
  registryUrl: 'https://example.com/registry.json',
  templateLayoutDir: 'src/templates',
};

const mockTemplateConfig = {
  id: 'landing',
  name: 'Landing Page',
  dependencies: ['framer-motion'],
  componentDependencies: ['button'],
  files: {
    main: { path: 'templates/landing.tsx', type: 'template' },
  },
};

describe('TemplateService', () => {
  let service: TemplateService;
  let mockRegistry: any;
  let mockDependency: any;
  let mockComponent: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadConfig).mockResolvedValue(mockConfig as any);

    service = new TemplateService();

    mockRegistry = vi.mocked(RegistryService).mock.instances[0];
    mockDependency = vi.mocked(DependencyService).mock.instances[0];
    mockComponent = vi.mocked(ComponentService).mock.instances[0];
  });

  describe('install', () => {
    it('successfully installs a template and its various dependencies', async () => {
      mockRegistry.getTemplateConfig.mockResolvedValue(mockTemplateConfig);
      vi.mocked(axios.get).mockResolvedValue({ data: 'template content' });
      vi.mocked(fs.ensureDir).mockResolvedValue(undefined as never);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined as never);

      await service.install('landing');

      expect(mockDependency.install).toHaveBeenCalledWith(['framer-motion'], false, false);
      expect(mockComponent.install).toHaveBeenCalledWith('button');
      expect(mockRegistry.getTemplateConfig).toHaveBeenCalledWith('landing');

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('landing/landing.tsx'),
        'template content'
      );
    });

    it('throws error if template not found', async () => {
      mockRegistry.getTemplateConfig.mockResolvedValue(undefined);
      await expect(service.install('unknown')).rejects.toThrow("Template 'unknown' not found.");
    });
  });
});
