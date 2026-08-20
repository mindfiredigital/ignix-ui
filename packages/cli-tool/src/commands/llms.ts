import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

async function findLlmsTxt(): Promise<string | null> {
  const candidates = [
    path.resolve(__dirname, 'llms.txt'),
    path.resolve(__dirname, '../../../../llms.txt'),
  ];

  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function createLlmsCommand() {
  return new Command()
    .name('llms')
    .description('Print the full AI agent reference (llms.txt) as plain markdown to stdout')
    .option('--json', 'Accepted for consistency with other commands; has no effect here')
    .option('--cwd <path>', 'Accepted for consistency with other commands; has no effect here')
    .action(async () => {
      const llmsPath = await findLlmsTxt();

      if (!llmsPath) {
        console.error('Could not locate llms.txt. Try reinstalling @mindfiredigital/ignix-cli.');
        process.exitCode = 1;
        return;
      }

      const content = await fs.readFile(llmsPath, 'utf-8');
      process.stdout.write(content);
    });
}

export const llmsCommand = createLlmsCommand();
