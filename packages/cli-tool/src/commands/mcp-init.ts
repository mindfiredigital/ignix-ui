import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

export const mcpInitCommand = new Command()
  .name('init')
  .description('Initialize MCP configuration for AI tools')
  .requiredOption('--client <client>', 'MCP client (cursor, vscode, claude)')
  .action(async (opts) => {
    const client = opts.client;

    let configPath = '';

    if (client === 'cursor') {
      configPath = path.resolve('.cursor/mcp.json');
    }

    if (client === 'vscode') {
      configPath = path.resolve('.vscode/mcp.json');
    }

    if (client === 'claude') {
      configPath = path.resolve('.mcp.json');
    }

    if (!configPath) {
      console.error('Unsupported MCP client:', client);
      process.exit(1);
    }

    const config = {
      mcpServers: {
        ignix: {
          command: 'ignix',
          args: ['mcp'],
        },
      },
    };

    await fs.ensureDir(path.dirname(configPath));
    await fs.writeJSON(configPath, config, { spaces: 2 });

    console.log(`MCP configured for ${client}`);
    console.log(`Created: ${configPath}`);
  });
