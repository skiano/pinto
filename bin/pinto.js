#! /usr/bin/env node
const { args } = require('../src/util')

switch (args.command) {
  case 'build':
    require('../src/build')()
    break;
  case 'dev':
    require('../src/dev')()
    break;
  case 'init':
    require('../src/init')()
}
