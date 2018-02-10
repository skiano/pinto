#! /usr/bin/env node
const path = require('path')
const chalk = require('chalk')
const deepmerge = require('deepmerge')

const COMMAND = process.argv.pop().toLowerCase()

switch (COMMAND) {
  case 'build':
    require('../src/build')()
    break;
  case 'dev':
    require('../src/dev')()
    break;
  case 'init':
    require('../src/init')()
}
