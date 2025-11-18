import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import { logger } from '../utils/logger';
import { TemplateService } from '../services/TemplateService';

async function showThemeMenu(): Promise<void> {
  const spinner = ora();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await prompts({
      type: 'select',
      name: 'action',
      message: 'What would you like to do with templates?',
      choices: [
        {
          title: 'List available templates',
          value: 'list',
        },
        {
          title: 'Install a Template Layout',
          value: 'install',
        },
        { title: 'Exit', value: 'exit' },
      ],
    });

    if (!response.action || response.action === 'exit') {
      logger.info('Exiting template manager.');
      break;
    }

    try {
      const templateService = new TemplateService();

      switch (response.action) {
        case 'list': {
          spinner.start('Fetching templates...');
          const templates = await templateService.getAvailableTemplateLayout();
          spinner.stop();
          console.log(templates, 43);
          if (templates.length === 0) {
            logger.warn('No templates available.');
          } else {
            console.log(chalk.bold('\nAvailable Templates:\n'));
            templates.forEach((template) => {
              console.log(chalk.cyan(`  • ${template?.components?.name}`));
              console.log(chalk.gray(`    ${template?.components?.description}\n`));
            });
          }
          break;
        }

        case 'install': {
          spinner.start('Fetching templates...');
          const templateData = await templateService.getAvailableTemplateLayout();
          spinner.stop();

          const templates = templateData.map((tpl: any) => ({
            title: tpl.name, // e.g., "SideBarLeftLayout"
            value: tpl.id, // e.g., "sidebar-left-layout"
          }));

          const installResponse = await prompts({
            type: 'select',
            name: 'templateId',
            message: 'Select a template to install:',
            choices: templates,
          });

          if (installResponse.templateId) {
            await templateService.install(installResponse.templateId);
          }

          break;
        }
      }
    } catch (error) {
      spinner.fail('An error occurred');
      if (error instanceof Error) logger.error(error.message);
    }

    console.log('');
  }
}

export const templateCommand = new Command()
  .name('template')
  .description(chalk.hex('#FF7F50')('Select the Template category'))
  .action(async () => {
    await showThemeMenu();
  });
