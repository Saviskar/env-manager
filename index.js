#!/usr/bin/env node

const { program } = require("commander");
const pkg = require("./package.json");

// Commands
const { initCommand } = require("./commands/init");
const { pushCommand } = require("./commands/push");
const { pullCommand } = require("./commands/pull");
const { loginCommand } = require("./commands/login");

program
  .name("env-manager")
  .description("A simple CLI tool to manage and sync .env files securely.")
  .version(pkg.version);

program
    .command("login")
    .description("Login in to env-manager")
    .action(loginCommand);

program
  .command("init")
  .description("Link this folder to a remote project")
  .action(initCommand);

program
  .command("push <environment>")
  .description("Push local .env to remote vault for the given environment")
  .action(pushCommand);

program
  .command("pull <environment>")
  .description("Pull .env from remote vault for the given environment")
  .action(pullCommand);

program.parse(process.argv);
