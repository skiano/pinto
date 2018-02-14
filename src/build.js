const chalk = require('chalk')
const transformJS = require('./transformJS')
const transformCSS = require('./transformCSS')
const transformHTML = require('./transformHTML')
const { loadConfig, transformFile, forceWriteFile, createTemplateData } = require('./util')

const build = () => {
  const config = loadConfig()

  const start = new Date()
  return Promise.all([
    transformFile(config.src.html),
    transformFile(config.src.data, JSON.parse),
    transformFile(config.src.css, transformCSS),
    transformFile(config.src.js, transformJS),
  ]).then(([html, data, css, js]) => (
    forceWriteFile(config.output, transformHTML(html, createTemplateData(css, js, data)))
  )).then(() => {
    console.log('built', chalk.cyan(`${new Date() - start}ms`))
  }).catch(err => {
    console.error(err)
  })
}

module.exports = build
