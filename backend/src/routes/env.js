import express from 'express';
import * as envService from '../services/envService.js';

const router = express.Router();

/**
 * POST /env/push
 * Body: { projectId, environment, envContent }
 * 
 * Takes the raw textual content of a .env file, encrypts it, 
 * and stores it as a new version in the database.
 */
router.post('/push', async (req, res) => {
  try {
    const { projectId, environment, envContent } = req.body;
    if (!projectId || !environment || envContent === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    await envService.pushEnv(projectId, environment, envContent);
    res.json({ success: true, message: 'Env pushed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /env/pull
 * Query Params: projectId, environment
 * 
 * Fetches the latest version of the .env file for the given project/environment.
 * Returns the decrypted content to the CLI.
 */
router.get('/pull', async (req, res) => {
  try {
    const { projectId, environment } = req.query;
    if (!projectId || !environment) {
      return res.status(400).json({ error: 'Missing required query params' });
    }
    const result = await envService.pullEnv(projectId, environment);
    if (!result) {
        // Return 404 if no history exists for this env yet
        return res.status(404).json({ error: 'No env found for this environment' });
    }
    res.json({ envContent: result.envContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
