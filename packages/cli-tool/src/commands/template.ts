// src/commands/template.ts
import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import { TemplateService } from '../services/TemplateService';
import { logger } from '../utils/logger';

async function showTemplateMenu(): Promise<void> {
  const spinner = ora();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await prompts({
      type: 'select',
      name: 'action',
      message: 'What would you like to do with templates?',
      choices: [
        { title: 'List available templates', value: 'list' },
        { title: 'Install a template', value: 'install' },
        { title: 'View template info', value: 'info' },
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
          spinner.start('Fetching available templates...');
          const templates = await templateService.getAvailableTemplates();
          spinner.stop();

          if (templates.length === 0) {
            logger.warn('No templates available.');
          } else {
            console.log(chalk.bold('\nAvailable Templates:\n'));

            // Group templates by category for better organization
            const templatesByCategory = templates.reduce((acc, template) => {
              const category = template.category || 'Uncategorized';
              if (!acc[category]) {
                acc[category] = [];
              }
              acc[category].push(template);
              return acc;
            }, {} as Record<string, typeof templates>);

            Object.entries(templatesByCategory).forEach(([category, categoryTemplates]) => {
              console.log(chalk.hex('#FF7F50')(`${category}:`));
              (categoryTemplates as any[]).forEach((template) => {
                console.log(chalk.cyan(`  • ${template.name}`) + chalk.gray(` (${template.id})`));
                console.log(chalk.gray(`    ${template.description}\n`));
              });
            });
          }
          break;
        }

        case 'install': {
          spinner.start('Fetching available templates...');
          const templates = await templateService.getAvailableTemplates();
          spinner.stop();

          if (templates.length === 0) {
            logger.warn('No templates available to install.');
            break;
          }

          const installResponse = await prompts({
            type: 'select',
            name: 'templateId',
            message: 'Select a template to install:',
            choices: templates.map((t) => ({
              title: `${t.name} - ${t.description}`,
              value: t.id,
              description: t.category ? `Category: ${t.category}` : undefined,
            })),
          });

          if (installResponse.templateId) {
            await templateService.install(installResponse.templateId);
          }
          break;
        }

        case 'info': {
          spinner.start('Fetching available templates...');
          const templates = await templateService.getAvailableTemplates();
          spinner.stop();

          if (templates.length === 0) {
            logger.warn('No templates available.');
            break;
          }

          const infoResponse = await prompts({
            type: 'select',
            name: 'templateId',
            message: 'Select a template to view details:',
            choices: templates.map((t) => ({
              title: t.name,
              value: t.id,
              description: t.category ? `Category: ${t.category}` : undefined,
            })),
          });

          if (infoResponse.templateId) {
            const template = await templateService.getTemplateConfig(infoResponse.templateId);
            if (template) {
              console.log(chalk.bold(`\n${template.name}`));
              console.log(chalk.gray(`ID: ${template.id}`));
              console.log(chalk.gray(`Description: ${template.description}`));
              if (template.category) {
                console.log(chalk.gray(`Category: ${template.category}`));
              }
              if (template.dependencies && template.dependencies.length > 0) {
                console.log(chalk.gray(`Dependencies: ${template.dependencies.join(', ')}`));
              }
              if (template.files && template.files.length > 0) {
                console.log(chalk.bold('\nFiles to be created:'));
                template.files.forEach((file: any) => {
                  console.log(chalk.gray(`  • ${file.path}`));
                });
              }
            }
          }
          break;
        }
      }
    } catch (error) {
      spinner.fail('An error occurred');
      if (error instanceof Error) {
        logger.error(error.message);
      }
    }

    console.log(''); // Add spacing before next menu
  }
}

export const templateCommand = new Command()
  .name('templates')
  .description(chalk.hex('#FF7F50')('Manage, install, and explore project templates.'))
  .action(async () => {
    await showTemplateMenu();
  });
