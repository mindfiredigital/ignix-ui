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
  name?: string;
  private?: boolean;
  dependencies?: Record<string, string>;
};

const IGNIX_PACKAGE = '@mindfiredigital/ignix-ui';
const IGNIX_VERSION = '^1.0.7';

async function detectPackageManager(): Promise<'npm' | 'yarn' | 'pnpm'> {
  if (await fs.exists('pnpm-lock.yaml')) return 'pnpm';
  if (await fs.exists('yarn.lock')) return 'yarn';
  return 'npm';
}

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

    let packageJson: PackageJson = {};
    let shouldInstall = false;

    const exists = await fs.exists(packageJsonPath);

    if (!exists) {
      packageJson = {
        name: path.basename(process.cwd()),
        private: true,
        dependencies: {},
      };
      shouldInstall = true;
    } else {
      try {
        packageJson = await fs.readJSON(packageJsonPath);
      } catch {
        packageJson = {};
      }
    }

    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    // Only add if not present
    if (!packageJson.dependencies[IGNIX_PACKAGE]) {
      packageJson.dependencies[IGNIX_PACKAGE] = IGNIX_VERSION;
      shouldInstall = true;
    }

    if (shouldInstall) {
      await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    }

    // =========================
    // ⚙️ MCP CONFIG
    // =========================
    const ignixServer: MCPServerConfig = {
      command: 'npx',
      args: ['ignix', 'mcp'],
    };

    await fs.ensureDir(path.dirname(configPath));

    let shouldWriteConfig = true;

    if (client === 'vscode') {
      const existing: VSCodeConfig = { servers: {} };

      if (await fs.exists(configPath)) {
        const data = (await fs.readJSON(configPath)) as VSCodeConfig;
        existing.servers = data.servers ?? {};

        if (existing.servers.ignix) {
          shouldWriteConfig = false;
        }
      }

      if (shouldWriteConfig) {
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
      }
    } else {
      const existing: CursorClaudeConfig = { mcpServers: {} };

      if (await fs.exists(configPath)) {
        const data = (await fs.readJSON(configPath)) as CursorClaudeConfig;
        existing.mcpServers = data.mcpServers ?? {};

        if (existing.mcpServers.ignix) {
          shouldWriteConfig = false;
        }
      }

      if (shouldWriteConfig) {
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
    }

    // =========================
    // 📦 INSTALL (ONLY IF NEEDED)
    // =========================
    console.log('✔ Configuring MCP server.');
    console.log('✔ Installing dependencies.\n');

    if (shouldInstall) {
      try {
        const pm = await detectPackageManager();

        if (pm === 'pnpm') {
          await execa('pnpm', ['install'], { stdio: 'ignore' });
        } else if (pm === 'yarn') {
          await execa('yarn', [], { stdio: 'ignore' });
        } else {
          await execa('npm', ['install', '--silent', '--no-audit', '--no-fund'], {
            stdio: 'ignore',
          });
        }
      } catch (error) {
        if (process.env.DEBUG) {
          console.error(error);
        }
      }
    }

    // =========================
    // 🎉 OUTPUT
    // =========================
    const relativePath = path.relative(process.cwd(), configPath).replace(/\\/g, '/');

    console.log(`Configuration saved to ${relativePath}.\n`);
  });
