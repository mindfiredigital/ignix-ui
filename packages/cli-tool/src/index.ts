import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import { createAddCommand } from './commands/add';
import { createInitCommand } from './commands/init';
import { createListCommand } from './commands/list';
import { createThemesCommand } from './commands/theme';
import { createDoctorCommand } from './commands/doctor';
import {
  createStartersCommandMonorepo,
  createStartersCommandNextjsApp,
  createStartersCommandViteReact,
} from './commands/starters';
import { logger } from './utils/logger';
import { RegistryService } from './services/RegistryService';
import { createTemplateCommand } from './commands/template';
import { createInfoCommand } from './commands/info';
import { createMcpInitCommand } from './commands/mcp-init';
import { createMcpStatusCommand } from './commands/mcp-status';
import { createLlmsCommand } from './commands/llms';

const program = new Command();

const isMachineMode = process.argv.includes('--json');
const isMcpMode = process.argv.includes('mcp');
const isLlmsMode = process.argv.includes('llms');

program.version(chalk.red('1.0.0'));
// Register Commands
program.addCommand(createInitCommand());
program.addCommand(createAddCommand());
program.addCommand(createListCommand());
program.addCommand(createThemesCommand());
program.addCommand(createStartersCommandMonorepo());
program.addCommand(createStartersCommandNextjsApp());
program.addCommand(createStartersCommandViteReact());
program.addCommand(createTemplateCommand());
program.addCommand(createDoctorCommand());
program.addCommand(createInfoCommand());
program.addCommand(createLlmsCommand());

const mcpCommand = new Command('mcp').description('Ignix MCP server');

mcpCommand
  .command('init')
  .description('Initialize MCP configuration')
  .option('--client <client>', 'MCP client (cursor, vscode, claude, windsurf, all)')
  .option('--dry-run', 'Preview changes without writing files')
  .option('--latest', 'Use latest version instead of pinned major version')
  .option('--universal', 'Configure all supported clients')
  .action(async (options) => {
    // Parse the command with the options
    const args = ['node', 'ignix', 'mcp', 'init'];

    if (options.client) {
      args.push('--client', options.client);
    }
    if (options.dryRun) {
      args.push('--dry-run');
    }
    if (options.latest) {
      args.push('--latest');
    }
    if (options.universal) {
      args.push('--universal');
    }

    await createMcpInitCommand().parseAsync(args);
  });

// status command
mcpCommand
  .command('status')
  .description('Check MCP configuration status')
  .option('--json', 'Machine output')
  .action(async (options) => {
    const args = ['node', 'ignix', 'mcp', 'status'];

    if (options.json) {
      args.push('--json');
    }

    await createMcpStatusCommand().parseAsync(args);
  });

program.addCommand(mcpCommand);

// Display welcome message
function showWelcome(): void {
  if (isMachineMode || isMcpMode || isLlmsMode) return;
  console.log(`
${chalk.hex('#FF0000').bold('  ██╗ ██████╗ ███╗   ██╗██╗███ ███╗    ██╗   ██╗██╗')}
${chalk.hex('#FF2A2A').bold('  ██║██╔════╝ ████╗  ██║██║╚██ ██╝║    ██║   ██║██║')}
${chalk.hex('#FF5555').bold('  ██║██║  ███╗██╔██╗ ██║██║ ╔███╗ ║    ██║   ██║██║')}
${chalk.hex('#FF8080').bold('  ██║██║   ██║██║╚██╗██║██║╔██ ██╗║    ██║   ██║██║')}
${chalk.hex('#FFAAAA').bold('  ██║╚██████╔╝██║ ╚████║██║███ ███║    ████████║██║')}
${chalk.hex('#FFD5D5').bold('  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚══════╝    ╚═══════╝╚═╝')}
  \n${chalk.hex('#FF5555')(
    'A ultimate CLI tool to create modern, production-ready React UI system designed to help you ship beautiful, animated, and accessible interfaces with incredible speed.'
  )} 🔥✨
`);
}

// Interactive CLI Mode
async function startInteractiveCLI(): Promise<void> {
  showWelcome();

  let isRunning = true;
  while (isRunning) {
    try {
      const response = await prompts({
        type: 'select',
        name: 'action',
        message: chalk.hex('#FF5555')('What would you like to do?'),
        choices: [
          { title: chalk.hex('#FF7A3D')('🚀 Initialize Ignix UI'), value: 'init' },
          { title: chalk.hex('#FF8C00')('➕ Add components'), value: 'add' },
          { title: chalk.hex('#FF6B35')('📋 List components'), value: 'list' },
          { title: chalk.hex('#FF7F50')('🎨 Manage themes'), value: 'themes' },
          { title: chalk.hex('#33A06F')('📦 Starters Template'), value: 'starters' },
          { title: chalk.hex('#FF4444')('🔌 MCP Server'), value: 'mcp' },
          { title: chalk.red('❌ Exit'), value: 'exit' },
        ],
        initial: 0,
      });

      if (!response.action || response.action === 'exit') {
        console.log(chalk.yellow('\n👋 Exiting Ignix CLI. Goodbye!\n'));
        isRunning = false;
        continue;
      }

      // Execute the selected command
      console.log('');

      switch (response.action) {
        case 'init': {
          await createInitCommand().parseAsync(['node', 'ignix']);
          break;
        }
        case 'add': {
          // Show interactive component selection
          const registryService = new RegistryService();
          const availableComponents = await registryService.getAvailableComponents();

          if (availableComponents.length === 0) {
            logger.warn('No components available in the registry.');
            break;
          }

          const response = await prompts({
            type: 'multiselect',
            name: 'components',
            message: 'Select components to add:',
            choices: availableComponents
              .filter((c: any) => c && (c.name || c.id))
              .map((c: any) => ({
                title: c.name || c.id,
                value: String(c.id || c.name).toLowerCase(),
                type: c.files?.main?.type || 'component',
                description: c.description || ' ',
              })),
            instructions: false,
            hint: '- Space to select. Return to submit',
          });

          const identifiers = response.components || [];

          if (identifiers.length > 0) {
            await createAddCommand().parseAsync(['node', 'ignix', 'component', ...identifiers]);
          } else {
            logger.info('No components selected.');
          }
          break;
        }
        case 'list': {
          await createListCommand().parseAsync(['node', 'ignix', 'component']);
          break;
        }
        case 'themes': {
          await createThemesCommand().parseAsync(['node', 'ignix']);
          break;
        }

        case 'starters': {
          const resp = await prompts({
            type: 'select',
            name: 'starter',
            message: 'Select a starter to scaffold:',
            choices: [
              { title: 'Vite + React (TypeScript + Tailwind + HMR)', value: 'vite-react' },
              { title: 'Next.js App (App Router + TypeScript + Tailwind)', value: 'nextjs-app' },
              { title: 'Monorepo (Turborepo + pnpm)', value: 'monorepo' },
            ],
            initial: 0,
          });
          if (resp.starter === 'vite-react') {
            await createStartersCommandViteReact().parseAsync([
              'node',
              'ignix',
              'starters',
              'vite-react',
            ]);
          } else if (resp.starter === 'monorepo') {
            await createStartersCommandMonorepo().parseAsync([
              'node',
              'ignix',
              'starters',
              'monorepo',
            ]);
          } else if (resp.starter === 'nextjs-app') {
            await createStartersCommandNextjsApp().parseAsync([
              'node',
              'ignix',
              'starters',
              'nextjs-app',
            ]);
          }
          break;
        }
        case 'templates': {
          await createTemplateCommand().parseAsync(['node', 'ignix', 'templates']);
          break;
        }
        case 'mcp': {
          const mcpResponse = await prompts({
            type: 'select',
            name: 'action',
            message: 'MCP Configuration:',
            choices: [
              { title: 'Configure MCP for all clients', value: 'universal' },
              { title: 'Configure MCP for specific client', value: 'specific' },
              { title: 'Check MCP status', value: 'status' },
              { title: 'Back', value: 'back' },
            ],
          });

          if (mcpResponse.action === 'universal') {
            await createMcpInitCommand().parseAsync([
              'node',
              'ignix',
              'mcp',
              'init',
              '--universal',
            ]);
          } else if (mcpResponse.action === 'specific') {
            const clientResponse = await prompts({
              type: 'select',
              name: 'client',
              message: 'Select client:',
              choices: [
                { title: 'Cursor', value: 'cursor' },
                { title: 'VS Code', value: 'vscode' },
                { title: 'Claude Desktop', value: 'claude' },
                { title: 'Windsurf', value: 'windsurf' },
              ],
            });
            if (clientResponse.client) {
              await createMcpInitCommand().parseAsync([
                'node',
                'ignix',
                'mcp',
                'init',
                '--client',
                clientResponse.client,
              ]);
            }
          } else if (mcpResponse.action === 'status') {
            await createMcpStatusCommand().parseAsync(['node', 'ignix', 'mcp', 'status']);
          }
          break;
        }
      }
      console.log('');
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      }
      // Continue the loop even if there's an error
    }
  }
}

export { program };

// Check if running in interactive mode or with arguments
async function main() {
  if (process.argv.length <= 2 && !isMachineMode && !isMcpMode) {
    // No arguments provided - start interactive mode
    await startInteractiveCLI().catch((error) => {
      console.error(chalk.red('Fatal error:'), error);
      process.exitCode = 1;
    });
  } else {
    // Arguments provided - run as normal CLI
    if (!isMachineMode) {
      showWelcome();
    }
    await program.parseAsync();
  }
}

// Only run if this file is the entry point
if (require.main === module) {
  main();
}
