import inquirer from 'inquirer';
import chalk from 'chalk';
import { writeGlobalConfig } from '../utils/config.js';

async function login() {
  console.log(chalk.blue.bold('envmng login'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'apiBaseUrl',
      message: 'Enter API Base URL:',
      default: 'http://localhost:3000',
    },
    {
      type: 'input',
      name: 'authToken',
      message: 'Enter API Token (dummy):',
      default: 'test-token',
    },
  ]);

  writeGlobalConfig({
    apiBaseUrl: answers.apiBaseUrl,
    authToken: answers.authToken,
  });

  console.log(chalk.green('✔ Configuration saved!'));
}

export default login;
