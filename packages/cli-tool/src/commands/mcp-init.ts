import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

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
        console.log(`Add this to ~/.codex/config.toml:\n`);
        console.log(`[mcp_servers.ignix]
command = "ignix"
args = ["mcp"]\n`);
        return;

      default:
        console.error('❌ Unsupported MCP client:', client);
        process.exit(1);
    }

    const ignixServer: MCPServerConfig = {
      command: 'ignix',
      args: ['mcp'],
    };

    await fs.ensureDir(path.dirname(configPath));

    // ✅ VS Code config
    if (client === 'vscode') {
      let existing: VSCodeConfig = { servers: {} };

      if (await fs.exists(configPath)) {
        const data = await fs.readJSON(configPath);
        existing = {
          servers: {
            ...(data.servers ?? {}),
          },
        };
      }

      const updated: VSCodeConfig = {
        servers: {
          ...existing.servers,
          ignix: ignixServer,
        },
      };

      await fs.writeJSON(configPath, updated, { spaces: 2 });
    }

    // ✅ Cursor + Claude config
    else {
      let existing: CursorClaudeConfig = { mcpServers: {} };

      if (await fs.exists(configPath)) {
        const data = await fs.readJSON(configPath);
        existing = {
          mcpServers: {
            ...(data.mcpServers ?? {}),
          },
        };
      }

      const updated: CursorClaudeConfig = {
        mcpServers: {
          ...existing.mcpServers,
          ignix: ignixServer,
        },
      };

      await fs.writeJSON(configPath, updated, { spaces: 2 });
    }

    // ✅ DX Logs
    console.log(`\n✅ MCP configured for ${client}`);
    console.log(`📁 File: ${configPath}`);
    console.log(`\nNext steps:`);

    if (client === 'cursor') {
      console.log('- Open Cursor Settings → MCP');
      console.log('- Enable Ignix server');
    }

    if (client === 'vscode') {
      console.log('- Open .vscode/mcp.json');
      console.log('- Click "Start" next to Ignix');
    }

    if (client === 'claude') {
      console.log('- Restart Claude Code');
      console.log('- Run /mcp');
    }

    console.log('');
  });
