import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import { addCommand } from './commands/add';
import { initCommand } from './commands/init';
import { listCommand } from './commands/list';
import { themesCommand } from './commands/theme';
import { doctorCommand } from './commands/doctor';
import {
  startersCommandMonorepo,
  startersCommandNextjsApp,
  startersCommandViteReact,
} from './commands/starters';
import { logger } from './utils/logger';
import { RegistryService } from './services/RegistryService';
import { templateCommand } from './commands/template';
import { startMcpServer } from './commands/mcp';
import { mcpInitCommand } from './commands/mcp-init';

const program = new Command();

const isMachineMode = process.argv.includes('--json');
const isMcpMode = process.argv.includes('mcp');

program.version(chalk.red('1.0.0'));
// Register Commands
program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(listCommand);
program.addCommand(themesCommand);
program.addCommand(startersCommandMonorepo);
program.addCommand(startersCommandNextjsApp);
program.addCommand(startersCommandViteReact);
program.addCommand(templateCommand);
program.addCommand(doctorCommand);

const mcpCommand = new Command('mcp').description('Ignix MCP server');

// default: start server
mcpCommand.action(async () => {
  await startMcpServer();
});

// init command
mcpCommand
  .command('init')
  .requiredOption('--client <client>')
  .action(async (opts) => {
    await mcpInitCommand.parseAsync(['node', 'ignix', '--client', opts.client]);
  });

// optional explicit start command
mcpCommand
  .command('start')
  .description('Start Ignix MCP server')
  .action(async () => {
    await startMcpServer();
  });

program.addCommand(mcpCommand);

// Display welcome message
function showWelcome(): void {
  if (isMachineMode || isMcpMode) return;
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

  // eslint-disable-next-line no-constant-condition
  while (true) {
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
          { title: chalk.red('❌ Exit'), value: 'exit' },
        ],
        initial: 0,
      });

      if (!response.action || response.action === 'exit') {
        console.log(chalk.yellow('\n👋 Exiting Ignix CLI. Goodbye!\n'));
        process.exit(0);
      }

      // Execute the selected command
      console.log(''); // Add spacing

      switch (response.action) {
        case 'init': {
          await initCommand.parseAsync(['node', 'ignix']);
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
            type: 'select',
            name: 'components',
            message: 'Select components to add:',
            choices: availableComponents.map((c: any) => ({
              title: c.name,
              value: c.name.toLowerCase(),
              type: c.files.main.type,
              description: c.description || ' ',
            })),
            instructions: false,
            hint: '- Space to select. Return to submit',
          });

          const identifiers = response.components ? [response.components] : [];

          if (identifiers && identifiers.length > 0) {
            await addCommand.parseAsync(['node', 'ignix', 'component', ...identifiers]);
          } else {
            logger.info('No components selected.');
          }
          break;
        }
        case 'list': {
          await listCommand.parseAsync(['node', 'ignix', 'component']);
          break;
        }
        case 'themes': {
          await themesCommand.parseAsync(['node', 'ignix']);
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
            await startersCommandViteReact.parseAsync(['node', 'ignix', 'starters', 'vite-react']);
          } else if (resp.starter === 'monorepo') {
            await startersCommandMonorepo.parseAsync(['node', 'ignix', 'starters', 'monorepo']);
          } else if (resp.starter === 'nextjs-app') {
            await startersCommandNextjsApp.parseAsync(['node', 'ignix', 'starters', 'nextjs-app']);
          }
          break;
        }
        case 'templates': {
          await templateCommand.parseAsync(['node', 'ignix', 'templates']);
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

// Check if running in interactive mode or with arguments
if (process.argv.length <= 2 && !isMachineMode && !isMcpMode) {
  // No arguments provided - start interactive mode
  startInteractiveCLI().catch((error) => {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  });
} else {
  // Arguments provided - run as normal CLI
  if (!isMachineMode) {
    showWelcome();
  }
  program.parse();
}
