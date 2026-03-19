import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';

type Client = 'cursor' | 'vscode' | 'claude' | 'codex';

type MCPServerConfig = {
  command: string;
  args: string[];
};

type CursorClaudeConfig = {
  mcpServers: Record<string, MCPServerConfig>;
};

type VSCodeConfig = {
  servers: Record<string, MCPServerConfig>;
};

type PackageJson = {
  dependencies?: Record<string, string>;
};

const IGNIX_PACKAGE = '@mindfiredigital/ignix-ui';
const IGNIX_VERSION = '^1.0.7';

export const mcpInitCommand = new Command()
  .name('init')
  .description('Initialize MCP configuration for AI tools')
  .requiredOption('--client <client>', 'MCP client (cursor, vscode, claude, codex)')
  .action(async (opts) => {
    const client: Client = opts.client;

    let configPath = '';

    switch (client) {
      case 'cursor':
        configPath = path.resolve('.cursor/mcp.json');
        break;
      case 'vscode':
        configPath = path.resolve('.vscode/mcp.json');
        break;
      case 'claude':
        configPath = path.resolve('.mcp.json');
        break;
      case 'codex':
        console.log('\n⚠️ Codex requires manual setup.\n');
        console.log(`[mcp_servers.ignix]
command = "npx"
args = ["ignix", "mcp"]\n`);
        return;
      default:
        console.error('❌ Unsupported MCP client:', client);
        process.exit(1);
    }

    // =========================
    // 📦 PACKAGE.JSON
    // =========================
    const packageJsonPath = path.resolve('package.json');

    let packageJson: PackageJson;

    const exists = await fs.exists(packageJsonPath);

    if (!exists) {
      packageJson = {
        dependencies: {},
      };
    } else {
      packageJson = await fs.readJSON(packageJsonPath);
    }

    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    packageJson.dependencies[IGNIX_PACKAGE] = IGNIX_VERSION;

    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });

    // =========================
    // ⚙️ MCP CONFIG
    // =========================
    const ignixServer: MCPServerConfig = {
      command: 'npx',
      args: ['ignix', 'mcp'],
    };

    await fs.ensureDir(path.dirname(configPath));

    if (client === 'vscode') {
      const existing: VSCodeConfig = { servers: {} };

      if (await fs.exists(configPath)) {
        const data = (await fs.readJSON(configPath)) as VSCodeConfig;
        existing.servers = data.servers ?? {};
      }

      await fs.writeJSON(
        configPath,
        {
          servers: {
            ...existing.servers,
            ignix: ignixServer,
          },
        },
        { spaces: 2 }
      );
    } else {
      const existing: CursorClaudeConfig = { mcpServers: {} };

      if (await fs.exists(configPath)) {
        const data = (await fs.readJSON(configPath)) as CursorClaudeConfig;
        existing.mcpServers = data.mcpServers ?? {};
      }

      await fs.writeJSON(
        configPath,
        {
          mcpServers: {
            ...existing.mcpServers,
            ignix: ignixServer,
          },
        },
        { spaces: 2 }
      );
    }

    // =========================
    // 📦 INSTALL (SILENT)
    // =========================
    console.log('✔ Configuring MCP server.');
    console.log('✔ Installing dependencies.\n');

    try {
      await execa('npm', ['install'], {
        stdio: 'ignore', // 🔥 hides npm logs
      });
    } catch {
      // silent fail (like shadcn)
    }

    // =========================
    // 🎉 FINAL OUTPUT
    // =========================
    console.log(`Configuration saved to ${configPath}.\n`);
  });
