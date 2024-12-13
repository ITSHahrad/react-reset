#! /usr/bin/env node
const { program } = require('commander');

program
.command('config')
.description('create configuration for react-restart package.')
.action(async () => {
  const { configType } = await import('../dist/config.js');
  return configType();
});

program
.command('reset')
.description('reset the react app to its initial version.')
.action(async () => {
  const reset = await import('../dist/reset.js');
  return reset.default();
});

program.parse(process.argv);