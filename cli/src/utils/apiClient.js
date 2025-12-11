const axios = require('axios');
const { readGlobalConfig } = require('./config');

function createApiClient() {
  const config = readGlobalConfig();
  const baseURL = config.apiBaseUrl;

  if (!baseURL) {
    throw new Error('API Base URL not configured. Run "envmng login" first.');
  }

  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.authToken || ''}`,
    },
  });

  return client;
}

module.exports = {
  createApiClient,
};
