#! /usr/bin/env node
const path = require('path')
const deepmerge = require('deepmerge')

const COMMAND = process.argv.pop().toLowerCase()

const PATH_PROJECT = process.cwd()
const PATH_CONFIG = path.resolve(PATH_PROJECT, 'pinto.config.js')

let config = {
  root: PATH_PROJECT,
  port: 3000,
  dist: 'dist',
  src: {
    html: 'src/index.html',
    css: 'src/index.css',
    js: 'src/index.js',
  },
}

try {
  config = deepmerge({}, config, require(PATH_CONFIG))
} catch (err) {
  console.log('using default config')
}

config.dist = path.resolve(config.root, config.dist)
config.src.html = path.resolve(config.root, config.src.html)
config.src.css = path.resolve(config.root, config.src.css)
config.src.js = path.resolve(config.root, config.src.js)

if (config.data) {
  try {
    config.templateData = require(path.resolve(config.root, config.templateData))
  } catch (e) {
    throw new Error(`Bad template data. could not resolve ${config.templateData}`)
  }
}

switch (COMMAND) {
  case 'build':
    console.log('build!', config)
    break;
  case 'dev':
    require('../src/dev')(config)
    break;
}
