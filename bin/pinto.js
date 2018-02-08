#! /usr/bin/env node
const path = require('path')
const chalk = require('chalk')
const deepmerge = require('deepmerge')

const COMMAND = process.argv.pop().toLowerCase()

const PATH_PROJECT = process.cwd()
const PATH_CONFIG = path.resolve(PATH_PROJECT, 'pinto.config.js')

let config = {
  root: PATH_PROJECT,
  port: 3000,
  dist: 'dist',
  output: 'index.html',
  templateData: 'src/templateData.js',
  src: {
    html: 'src/index.html',
    css: 'src/index.css',
    js: 'src/index.js',
  },
}

try {
  config = deepmerge({}, config, require(PATH_CONFIG))
} catch (err) {
  console.log(chalk.cyan('using default config'))
}

config.dist = path.resolve(config.root, config.dist)
config.output = path.resolve(config.root, config.dist, config.output)
config.templateData = path.resolve(config.root, config.templateData)
config.src.html = path.resolve(config.root, config.src.html)
config.src.css = path.resolve(config.root, config.src.css)
config.src.js = path.resolve(config.root, config.src.js)

try {
  config.templateData = require(config.templateData)
} catch (e) {
  config.templateData = {}
}

switch (COMMAND) {
  case 'build':
    require('../src/build')(config)
    break;
  case 'dev':
    require('../src/dev')(config)
    break;
}
