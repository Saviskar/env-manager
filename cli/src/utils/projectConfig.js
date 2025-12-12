import fs from 'fs';
import path from 'path';

const PROJECT_CONFIG_FILE = '.envmng.json';

export function readProjectConfig(cwd = process.cwd()) {
  const filePath = path.join(cwd, PROJECT_CONFIG_FILE);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    throw new Error('Failed to parse .envmng.json');
  }
}

export function writeProjectConfig(config, cwd = process.cwd()) {
  const filePath = path.join(cwd, PROJECT_CONFIG_FILE);
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}
