import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { createApiClient } from '../utils/apiClient.js';
import { readProjectConfig } from '../utils/projectConfig.js';

/**
 * Pushes the local .env content to the remote vault.
 * 
 * @param {string} environment - The target environment (e.g. 'development')
 * 
 * Workflow:
 * 1. Validates that the project is initialized (.envmng.json exists).
 * 2. Verifies that the target environment is allowed in the config.
 * 3. Reads the raw content of the local `.env` file.
 * 4. Sends content + projectId + env to the backend.
 */
async function push(environment) {
  // 1. Validation
  const projectConfig = readProjectConfig();
  if (!projectConfig) {
    console.error(chalk.red('Error: Not an initialized project. Run "envmng init" first.'));
    return;
  }

  // 2. Environment check
  if (!projectConfig.environments.includes(environment)) {
    console.error(chalk.red(`Error: Environment "${environment}" is not configured for this project.`));
    return;
  }

  // 3. Read .env
  const envFilePath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envFilePath)) {
    console.error(chalk.red('Error: .env file not found in current directory.'));
    return;
  }

  const envContent = fs.readFileSync(envFilePath, 'utf-8');

  try {
    const api = createApiClient();
    // 4. Send to API
    await api.post('/env/push', {
      projectId: projectConfig.projectId,
      environment,
      envContent,
    });
    console.log(chalk.green('✅ .env pushed successfully!'));
  } catch (error) {
    console.error(chalk.red('Error pushing env:'), error.message);
     if (error.response) {
       console.error(chalk.red('Server Response:'), error.response.data);
    }
  }
}

export default push;
