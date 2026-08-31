import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import chalk from 'chalk';
import type {
  MCPServerConfig,
  CursorClaudeConfig,
  VSCodeConfig,
  PackageJson,
  MCPClientConfig,
} from '../types/index.js';
import { getErrorMessage } from '../utils/error-handler';

type Client = 'cursor' | 'vscode' | 'claude' | 'windsurf' | 'codex';

const IGNIX_PACKAGE = '@mindfiredigital/ignix-ui';
const IGNIX_VERSION = '^1.0.7';
const VALID_CLIENTS: Client[] = ['cursor', 'vscode', 'claude', 'windsurf', 'codex'];

async function detectPackageManager(): Promise<'npm' | 'yarn' | 'pnpm'> {
  if (await fs.pathExists('pnpm-lock.yaml')) return 'pnpm';
  if (await fs.pathExists('yarn.lock')) return 'yarn';
  return 'npm';
}

function getConfigPath(client: Client): string {
  const paths: Record<Client, string> = {
    cursor: '.cursor/mcp.json',
    vscode: '.vscode/mcp.json',
    claude: '.mcp.json',
    windsurf: '.windsurf/mcp.json',
    codex: '', // Codex requires manual setup
  };
  return paths[client];
}

function getConfigContent(
  client: Client,
  server: MCPServerConfig
): CursorClaudeConfig | VSCodeConfig {
  if (client === 'vscode') {
    return { servers: { ignix: server } };
  }
  return { mcpServers: { ignix: server } };
}

export function createMcpInitCommand() {
  return new Command()
    .name('init')
    .description('Initialize MCP configuration for AI tools')
    .option('--client <client>', 'MCP client (cursor, vscode, claude, windsurf, codex)')
    .option('--dry-run', 'Preview changes without writing files')
    .option('--latest', 'Use latest version instead of pinned major version')
    .option('--universal', 'Configure all supported clients')
    .action(async (opts) => {
      if (process.env.MCP_INIT_RUNNING) {
        return;
      }
      process.env.MCP_INIT_RUNNING = 'true';

      // VALIDATION: Check if either --client or --universal is provided
      if (!opts.client && !opts.universal) {
        console.error(chalk.red('❌ Error: Either --client or --universal is required'));
        console.log(chalk.gray('\nExamples:'));
        console.log(chalk.gray('  npx ignix mcp init --universal'));
        console.log(chalk.gray('  npx ignix mcp init --client cursor'));
        console.log(chalk.gray('  npx ignix mcp init --client vscode --dry-run'));
        process.exitCode = 1;
        return;
      }

      if (opts.client === 'all') {
        opts.universal = true;
        opts.client = null;
      }

      try {
        // VALIDATION: Check if client is valid when provided
        if (opts.client && !VALID_CLIENTS.includes(opts.client as Client)) {
          console.error(chalk.red(`❌ Error: Invalid client '${opts.client}'`));
          console.log(chalk.gray(`\nValid clients: ${VALID_CLIENTS.join(', ')}`));
          console.log(chalk.gray(`\nOr use --universal to configure all clients`));
          process.exitCode = 1;
          return;
        }

        // Handle 'all' as alias for '--universal'
        if (opts.client === 'all') {
          opts.universal = true;
          opts.client = null;
        }

        const clients: Client[] = opts.universal
          ? ['cursor', 'vscode', 'claude', 'windsurf']
          : [opts.client as Client];

        const versionPin = opts.latest ? 'latest' : '^1';

        // FIX: Always include '-y' for all clients
        const ignixServer: MCPServerConfig = {
          command: 'npx',
          args: ['-y', `@mindfiredigital/ignix-mcp-server@${versionPin}`],
        };

        if (opts.dryRun) {
          console.log(chalk.yellow('\n🔍 DRY RUN - No files will be written\n'));
          for (const client of clients) {
            const configPath = getConfigPath(client);
            if (!configPath) {
              console.log(chalk.yellow(`⚠️  ${client} requires manual setup`));
              if (client === 'codex') {
                console.log(chalk.gray(`   [mcp_servers.ignix]`));
                console.log(chalk.gray(`   command = "npx"`));
                console.log(
                  chalk.gray(
                    `   args = ["-y", "@mindfiredigital/ignix-mcp-server@${versionPin}"]\n`
                  )
                );
              }
              continue;
            }
            console.log(chalk.cyan(`\n📝 ${client}:`));
            console.log(chalk.gray(`   Would create/update: ${configPath}`));
            console.log(chalk.gray(`   Content:`));
            console.log(JSON.stringify(getConfigContent(client, ignixServer), null, 2));
            console.log('');
          }
          console.log(chalk.gray('✨ Run without --dry-run to apply changes\n'));

          return;
        }

        console.log(chalk.bold('\n🚀 Initializing Ignix MCP Server\n'));
        console.log(
          chalk.cyan(
            `Version pin: ${
              versionPin === 'latest' ? 'latest (unpinned)' : '^1 (pinned major version)'
            }\n`
          )
        );

        for (const client of clients) {
          const configPath = getConfigPath(client);

          if (!configPath) {
            if (client === 'codex') {
              console.log(chalk.yellow(`\n⚠️ Codex requires manual setup:`));
              console.log(
                chalk.gray(`[mcp_servers.ignix]\ncommand = "npx"\nargs = ["-y", "ignix", "mcp"]\n`)
              );
            }
            continue;
          }

          await configureClient(client, configPath, ignixServer);
        }

        // Update package.json if needed
        await updatePackageJson();

        console.log(chalk.green('\n✅ MCP configuration complete!'));
        console.log(chalk.gray('\nRestart your AI tool to start using Ignix UI.\n'));
      } finally {
        delete process.env.MCP_INIT_RUNNING;
      }
    });
}

export const mcpInitCommand = createMcpInitCommand();

async function configureClient(
  client: Client,
  configPath: string,
  server: MCPServerConfig
): Promise<void> {
  const fullPath = path.resolve(configPath);
  await fs.ensureDir(path.dirname(fullPath));

  let existingConfig: MCPClientConfig = {};
  if (await fs.pathExists(fullPath)) {
    existingConfig = await fs.readJSON(fullPath);
  }

  const newConfig = {
    ...existingConfig,
    ...getConfigContent(client, server),
  };

  await fs.writeJSON(fullPath, newConfig, { spaces: 2 });
  console.log(chalk.green(`✅ Configured ${client} at ${configPath}`));
}

async function updatePackageJson(): Promise<void> {
  const packageJsonPath = path.resolve('package.json');

  if (!(await fs.pathExists(packageJsonPath))) {
    console.log(chalk.yellow('⚠️ No package.json found, skipping dependency installation'));
    return;
  }

  try {
    const packageJson = (await fs.readJSON(packageJsonPath)) as PackageJson;

    if (!packageJson.dependencies?.[IGNIX_PACKAGE]) {
      packageJson.dependencies = packageJson.dependencies || {};
      packageJson.dependencies[IGNIX_PACKAGE] = IGNIX_VERSION;
      await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });

      console.log(chalk.blue('📦 Installing dependencies...'));
      const pm = await detectPackageManager();

      if (pm === 'pnpm') {
        await execa('pnpm', ['install'], { stdio: 'ignore' });
      } else if (pm === 'yarn') {
        await execa('yarn', [], { stdio: 'ignore' });
      } else {
        await execa('npm', ['install', '--silent', '--no-audit', '--no-fund'], { stdio: 'ignore' });
      }

      console.log(chalk.green('✅ Dependencies installed'));
    }
  } catch (error) {
    console.log(chalk.yellow(`⚠️ Failed to update package.json: ${getErrorMessage(error)}`));
  }
}
