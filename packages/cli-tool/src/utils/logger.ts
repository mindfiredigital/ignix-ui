import chalk from 'chalk';

export const logger = {
  info(message: string): void {
    console.log(chalk.blue(`[INFO] ${message}`));
  },
  success(message: string): void {
    console.log(chalk.green(`[SUCCESS] ${message}`));
  },
  warn(message: string): void {
    console.log(chalk.yellow(`[WARN] ${message}`));
  },
  error(message: string): void {
    console.error(chalk.red(`[ERROR] ${message}`));
  },
};
