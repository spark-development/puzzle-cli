"use strict";

const cli = require("cli");
const fs = require("fs");
const path = require("path");
const packageJson = require("../package.json");

global.cli = cli;

const commands = {};
const commandsList = {};

const commandsDir = path.resolve(__dirname, "commands");
const commandsDirListing = fs.readdirSync(commandsDir);

commandsDirListing.forEach((commandFile) => {
  if (path.extname(commandFile) !== ".js") {
    return;
  }

  const commandClass = require(path.resolve(__dirname, "commands", commandFile));
  const commandInstance = new commandClass(cli);
  commands[commandInstance.name] = commandInstance;
  commandsList[commandInstance.name] = commandInstance.description;
});


cli.enable("help", "version", "status");
cli.setApp("puzzle", packageJson.version);
if (cli.args.length === 0 || !commands[cli.args[0]]) {
  cli.parse({}, commandsList);
  process.exit(255);
}

cli.parse(commands[cli.args[0]].options, commandsList);
commands[cli.command].run(cli.args, cli.options);

