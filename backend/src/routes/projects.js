import express from 'express';
import * as envService from '../services/envService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, environments } = req.body;
    if (!name || !environments) {
      return res.status(400).json({ error: 'Name and environments are required' });
    }
    const project = await envService.createProject(name, environments);
    res.json({
        projectId: project.id,
        name: project.name,
        environments: project.environments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
