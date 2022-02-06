console.log('imported build')

// const fs = require('fs-extra')
// const chalk = require('chalk')
// const transformJS = require('./transformJS')
// const transformCSS = require('./transformCSS')
// const transformHTML = require('./transformHTML')
// const { loadConfig, transformFile, forceWriteFile, createTemplateData } = require('./util.mjs')

// const copyStaticFiles = (config) => (
//   fs.copy(config.src.static, `${config.dist}/${config.staticRoute}`)
// )

// const build = () => {
//   const config = loadConfig()

//   const start = new Date()
//   return Promise.all([
//     copyStaticFiles(config),
//     transformFile(config.src.html),
//     transformFile(config.src.data, JSON.parse),
//     transformFile(config.src.css, transformCSS),
//     transformFile(config.src.js, transformJS),
//   ]).then(([_, html, data, css, js]) => (
//     forceWriteFile(
//       config.output,
//       transformHTML(html, createTemplateData(config, css, js, data)),
//       true,
//     )
//   )).then(() => {
//     console.log('built', chalk.cyan(`${new Date() - start}ms`))
//   }).catch(err => {
//     console.error(err)
//   })
// }

// module.exports = build
