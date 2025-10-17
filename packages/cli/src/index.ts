/**
 * CLI entry point
 * Sets up command structure and routing
 */
import { Command } from 'commander';
import { AddCommand } from './commands/add';
import { InitCommand } from './commands/init';

const program = new Command();

// Configure CLI metadata
program.name('ignix-ui').description('CLI for adding ignix-ui components').version('0.1.0');

// Initialize command
program
  .command('init')
  .description('Initialize animations in your project')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async () => {
    const command = new InitCommand();
    await command.execute();
  });

// Add component command
program
  .command('add')
  .description('Add an animation component to your project')
  .argument('[component]', 'The component to add')
  .action(async (component) => {
    const command = new AddCommand();
    await command.execute(component);
  });

program.parse();

export * from './themes';
