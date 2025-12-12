import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { createApiClient } from '../utils/apiClient.js';
import { readProjectConfig } from '../utils/projectConfig.js';

/**
 * Pulls the latest secret version from the vault and writes to .env.
 * 
 * @param {string} environment - The target environment to fetch (e.g. 'production')
 * 
 * Workflow:
 * 1. Check for project initialization.
 * 2. Request latest env version from Backend API.
 * 3. Overwrite local `.env` file with the received content.
 */
async function pull(environment) {
  const projectConfig = readProjectConfig();
  if (!projectConfig) {
    console.error(chalk.red('Error: Not an initialized project. Run "envmng init" first.'));
    return;
  }

    if (!projectConfig.environments.includes(environment)) {
    console.error(chalk.red(`Error: Environment "${environment}" is not configured for this project.`));
    return;
  }

  try {
    const api = createApiClient();
    // 2. Fetch from API
    const response = await api.get('/env/pull', {
        params: {
            projectId: projectConfig.projectId,
            environment
        }
    });

    const { envContent } = response.data;
    
    // 3. Write to file
    const envFilePath = path.join(process.cwd(), '.env');
    fs.writeFileSync(envFilePath, envContent);

    console.log(chalk.green(`✅ .env pulled successfully from ${environment}!`));

  } catch (error) {
    console.error(chalk.red('Error pulling env:'), error.message);
     if (error.response) {
       console.error(chalk.red('Server Response:'), error.response.data);
    }
  }
}

export default pull;
