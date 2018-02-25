const path = require('path')
const inquirer = require('inquirer')
const {
  fromSrc,
  fromRoot,
  configFile,
  forceWriteFile,
  createConfig,
  createDefaultHTML,
  createDefaultCSS,
  createDefaultJS,
} = require('./util')

const stubHtml = (config) => (
  forceWriteFile(fromSrc(config.src.html), createDefaultHTML(config))
)

const stubTemplateData = (config) => (
  config.src.data && forceWriteFile(
    fromSrc(config.src.data),
    JSON.stringify({ title: 'pinto', heading: 'Hello Pinto!' }, null, 2)
  )
)

const stubCSS = (config) => (
  forceWriteFile(fromSrc(config.src.css), createDefaultCSS())
)

const stubJS = (config) => (
  forceWriteFile(fromSrc(config.src.js), createDefaultJS())
)

const stubConfiguration = (config) => (
  forceWriteFile(
    fromSrc(`${config.src.static}/example.svg`), 'hello!',
    true
  )
)

const stubStatic = (config) => (
  forceWriteFile(
    fromRoot(`${configFile}.json`), JSON.stringify(config, null, 2),
    true
  )
)

const init = () => (
  inquirer.prompt([
    {
      type: 'input',
      message: 'port',
      name: 'port',
      default: 3000,
      validate(v) {
        return isNaN(v)
          ? 'port must be a number'
          : true
      }
    },
    {
      type: 'confirm',
      message: 'include template data',
      name: 'useData',
    },
    // TODO: check if this is ok to build
    // (ie is this going to overwrite any files)
  ]).then(answers => {
    const config = createConfig(answers)

    return Promise.all([
      stubHtml(config),
      stubCSS(config),
      stubJS(config),
      stubStatic(config),
      stubTemplateData(config),
      stubConfiguration(config),
    ])
  })
).catch(err => {
  console.error(err)
})

module.exports = init
