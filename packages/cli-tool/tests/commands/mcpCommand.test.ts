import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMcpInitCommand } from '../../src/commands/mcp-init';
import { createMcpStatusCommand } from '../../src/commands/mcp-status';
import fs from 'fs-extra';
import { setupTestMocks, resetTestState, runCommand, parseJsonOutput, exitCode } from '../helpers';

// --- Mocks ---
vi.mock('fs-extra', () => ({
  default: {
    pathExists: vi.fn(),
    ensureDir: vi.fn(),
    readJSON: vi.fn(),
    writeJSON: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    remove: vi.fn(),
    copy: vi.fn(),
  },
  pathExists: vi.fn(),
  ensureDir: vi.fn(),
  readJSON: vi.fn(),
  writeJSON: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
  remove: vi.fn(),
  copy: vi.fn(),
}));
vi.mock('execa');

setupTestMocks();

beforeEach(() => {
  delete process.env.MCP_INIT_RUNNING;
  resetTestState();
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ version: '1.1.0' }),
    })
  );

  // Default FS mocks
  vi.mocked(fs.pathExists).mockResolvedValue(true as never);
  vi.mocked(fs.ensureDir).mockResolvedValue(undefined as never);
  vi.mocked(fs.readJSON).mockResolvedValue({} as never);
  vi.mocked(fs.writeJSON).mockResolvedValue(undefined as never);
});

afterEach(() => {
  delete process.env.MCP_INIT_RUNNING;
});

describe('mcp commands', () => {
  describe('init', () => {
    it('errors when neither --client nor --universal is provided', async () => {
      await runCommand(createMcpInitCommand, []);
      expect(exitCode).toBe(1);
    });

    it('configures a specific client successfully', async () => {
      await runCommand(createMcpInitCommand, ['--client', 'cursor']);

      expect(fs.writeJSON).toHaveBeenCalledWith(
        expect.stringMatching(/[\\/]\.cursor[\\/]mcp\.json/),
        expect.objectContaining({ mcpServers: expect.anything() }),
        expect.anything()
      );
    });

    it('handles --universal flag', async () => {
      await runCommand(createMcpInitCommand, ['--universal']);

      expect(fs.writeJSON).toHaveBeenCalledTimes(5); // 4 clients + package.json update
    });

    it('performs dry run without writing files', async () => {
      await runCommand(createMcpInitCommand, ['--universal', '--dry-run']);
      expect(fs.writeJSON).not.toHaveBeenCalled();
    });
  });

  describe('status', () => {
    it('reports status as JSON', async () => {
      vi.mocked(fs.pathExists).mockImplementation((path: any) => {
        if (path.toString().replace(/\\/g, '/').includes('.cursor/mcp.json'))
          return Promise.resolve(true);
        return Promise.resolve(false);
      });
      vi.mocked(fs.readJSON).mockResolvedValue({
        mcpServers: { ignix: { args: ['@mindfiredigital/ignix-mcp-server@1.0.0'] } },
      } as never);

      await runCommand(createMcpStatusCommand, ['--json']);

      const output = parseJsonOutput();
      expect(output.success).toBe(true);
      const cursor = output.clients.find((c: any) => c.name === 'Cursor');
      expect(cursor.configured).toBe(true);
      expect(cursor.status).toBe('outdated');
    });

    it('detects up-to-date configuration', async () => {
      vi.mocked(fs.pathExists).mockResolvedValue(true as never);
      vi.mocked(fs.readJSON).mockResolvedValue({
        mcpServers: { ignix: { args: ['@mindfiredigital/ignix-mcp-server@1.1.0'] } },
      } as never);

      await runCommand(createMcpStatusCommand, ['--json']);

      const output = parseJsonOutput();
      const cursor = output.clients.find((c: any) => c.name === 'Cursor');
      expect(cursor.status).toBe('ok');
    });

    it('displays human-readable status for configured and outdated clients', async () => {
      const { consoleOutput } = await import('../helpers');

      vi.mocked(fs.pathExists).mockImplementation((path: any) => {
        if (path.toString().replace(/\\/g, '/').includes('.cursor/mcp.json'))
          return Promise.resolve(true);
        if (path.toString().replace(/\\/g, '/').includes('.vscode/mcp.json'))
          return Promise.resolve(true);
        return Promise.resolve(false);
      });

      vi.mocked(fs.readJSON).mockImplementation((path: any) => {
        const normalizedPath = path.toString().replace(/\\/g, '/');
        if (normalizedPath.includes('.cursor/mcp.json')) {
          return Promise.resolve({
            mcpServers: { ignix: { args: ['@mindfiredigital/ignix-mcp-server@1.0.0'] } },
          });
        }
        if (normalizedPath.includes('.vscode/mcp.json')) {
          return Promise.resolve({
            mcpServers: { ignix: { args: ['@mindfiredigital/ignix-mcp-server@1.1.0'] } },
          });
        }
        return Promise.resolve({});
      });

      await runCommand(createMcpStatusCommand, []);

      const output = consoleOutput.join('\n');
      expect(output).toContain('Ignix MCP Status');
      expect(output).toContain('Cursor → config exists but server version is outdated');
      expect(output).toContain('VS Code → ✅ configured');
      expect(output).toContain('Configured: 2/4 clients');
    });

    it('reports error reading config in human mode', async () => {
      const { consoleOutput } = await import('../helpers');

      vi.mocked(fs.pathExists).mockResolvedValue(true as never);
      vi.mocked(fs.readJSON).mockRejectedValue(new Error('JSON parse error') as never);

      await runCommand(createMcpStatusCommand, []);

      const output = consoleOutput.join('\n');
      expect(output).toContain('Error reading config: JSON parse error');
    });
  });
});
