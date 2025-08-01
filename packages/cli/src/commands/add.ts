import prompts from 'prompts';
import ora from 'ora';
import chalk from 'chalk';
import { ComponentService } from '../services/ComponentService';
import { DependencyService } from '../services/DependencyService';
import { Logger } from '../utils/logger';
import { TelemetryService } from '../services/TelemetryService';
import { CLIError } from '../errors/CLIError';

export class AddCommand {
  private componentService = ComponentService.getInstance();
  private dependencyService = DependencyService.getInstance();
  private logger = new Logger();

  async execute(componentName?: string): Promise<void> {
    const spinner = ora();
    const telemetry = TelemetryService.getInstance();

    try {
      // Track command start
      await telemetry.trackEvent('add_command_start');

      // Get component name with progress
      spinner.start('Loading available components...');
      componentName = await this.getComponentName(componentName);
      spinner.succeed();

      // Fetch component with progress
      spinner.start(`Fetching ${componentName} component...`);
      const component = await this.componentService.getComponent(componentName);
      spinner.succeed();

      // Install dependencies with progress
      if (component.dependencies?.length) {
        spinner.start('Installing dependencies...');
        await this.dependencyService.installDependencies(component.dependencies);
        spinner.succeed();
      }

      // Install component with progress
      spinner.start('Installing component files...');
      await this.componentService.installComponent(component);
      spinner.succeed(chalk.green(`Successfully added ${component.name}`));

      if (componentName === 'table') {
        spinner.start('Adding pagination component...');
        try {
          const paginationComponent = await this.componentService.getComponent('pagination');
          if (paginationComponent.dependencies?.length) {
            await this.dependencyService.installDependencies(paginationComponent.dependencies);
          }
          await this.componentService.installComponent(paginationComponent);
          spinner.succeed(chalk.green('Successfully added pagination component'));
          this.logger.printUsageInstructions(paginationComponent);
        } catch (error) {
          spinner.fail();
          this.logger.error('Failed to add pagination component.');
        }
      }

      // Track successful installation
      await telemetry.trackEvent('add_command_success', {
        component: componentName,
      });

      this.logger.printUsageInstructions(component);
    } catch (error) {
      spinner.fail();

      // Track failure
      await telemetry.trackEvent('add_command_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      if (error instanceof CLIError) {
        this.logger.error(error.message, error.suggestions);
      } else {
        this.logger.error(error instanceof Error ? error.message : 'Unknown error');
      }
      process.exit(1);
    }
  }

  private async getComponentName(name?: string): Promise<string> {
    if (name) return name.toLowerCase();

    const components = await this.componentService.getAvailableComponents();

    const response = await prompts({
      type: 'select',
      name: 'component',
      message: 'Select a component to add',
      choices: components.map((c) => ({
        title: c.name,
        value: c.name.toLowerCase(),
        description: c.description,
      })),
    });

    if (!response.component) {
      throw new Error('No component selected');
    }

    return response.component;
  }
}
