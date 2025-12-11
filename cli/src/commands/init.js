const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const { createApiClient } = require('../utils/apiClient');
const { writeProjectConfig, readProjectConfig } = require('../utils/projectConfig');
const { readGlobalConfig } = require('../utils/config');

/**
 * Initializes a new project in the current directory.
 * 
 * Workflow:
 * 1. CHECKS if a project config (.envmng.json) already exists.
 * 2. PROMPTS the user for project name and environments.
 * 3. API CALL to create the project in the backend DB.
 * 4. WRITES the received Project ID and config to .envmng.json locally.
 */
async function init() {
  // 1. Check if already initialized
  const existingConfig = readProjectConfig();
  if (existingConfig) {
    console.log(chalk.yellow('Project already initialized in this directory.'));
    return;
  }

  const cwdName = path.basename(process.cwd());

  // 2. Prompt user
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project Name:',
      default: cwdName,
    },
    {
      type: 'checkbox',
      name: 'environments',
      message: 'Select environments:',
      choices: ['development', 'staging', 'production'],
      default: ['development', 'production'],
    },
  ]);

  try {
    const api = createApiClient();
    
    // 3. Register project with backend
    const response = await api.post('/projects', {
      name: answers.projectName,
      environments: answers.environments,
    });

    const projectData = response.data;
    const globalConfig = readGlobalConfig();

    const config = {
      projectId: projectData.projectId,
      projectName: projectData.name,
      environments: projectData.environments,
      apiBaseUrl: globalConfig.apiBaseUrl,
      createdAt: new Date().toISOString(),
      version: 1,
    };

    // 4. Save local project config (committed to git)
    writeProjectConfig(config);
    console.log(chalk.green(`✔ Project initialized! Project ID: ${projectData.projectId}`));

  } catch (error) {
    console.error(chalk.red('Error initializing project:'), error.message);
    if (error.response) {
       console.error(chalk.red('Server Response:'), error.response.data);
    }
  }
}

module.exports = init;
