import { Command } from 'commander';
import { logger } from '../utils/logger';
import chalk from 'chalk';

export const wizardCommand = new Command()
  .name('wizard')
  .description(
    chalk.hex('#FF6B35')('Launch interactive generators for themes, components, or setup.')
  )
  .command('theme', 'Launch the interactive theme creator.')
  .command('component', 'Launch the interactive component scaffolder.')
  .command('setup', 'Run the guided project setup.')
  .action(() => {
    logger.warn('Wizards are coming soon!');
  });
