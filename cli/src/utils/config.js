import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.envmng');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function readGlobalConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }
  try {
    const rawData = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    return {};
  }
}

export function writeGlobalConfig(config) {
  ensureConfigDir();
  const currentConfig = readGlobalConfig();
  const newConfig = { ...currentConfig, ...config };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
}
