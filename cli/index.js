#!/usr/bin/env node

import { Command } from 'commander';
import login from './src/commands/login.js';
import init from './src/commands/init.js';
import push from './src/commands/push.js';
import pull from './src/commands/pull.js';

const program = new Command();

program
  .name('envmng')
  .description('Git-for-.env secrets sync tool')
  .version('1.0.0');

program
  .command('login')
  .description('Configure API URL and auth token')
  .action(login);

program
  .command('init')
  .description('Link the current folder to a remote Project')
  .action(init);

program
  .command('push <environment>')
  .description('Read local .env, send to API, store encrypted')
  .action(push);

program
  .command('pull <environment>')
  .description('Fetch from API, decrypt, and write .env')
  .action(pull);

program.parse(process.argv);
