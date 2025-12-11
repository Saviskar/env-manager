const inquirer = require('inquirer');
const chalk = require('chalk');
const { writeGlobalConfig } = require('../utils/config');

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

module.exports = login;
