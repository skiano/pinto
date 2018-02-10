const path = require('path')
const inquirer = require('inquirer')
const deepmerge = require('deepmerge')
const {
  fromRoot,
  forceWriteFile,
  defaultConfig,
  createDefaultHTML,
  createDefaultCSS,
  createDefaultJS,
} = require('./util')

const stubHtml = (answers, config) => (
  forceWriteFile(fromRoot(config.src.html), createDefaultHTML({
    title: answers.packageName,
    useData: answers.useTemplateData,
  }))
)

const stubTemplateData = (answers, config) => (
  answers.useTemplateData ? forceWriteFile(fromRoot(config.src.data), JSON.stringify({
    title: answers.packageName,
  }, null, 2)) : null
)

const stubCSS = (answers, config) => (
  forceWriteFile(fromRoot(config.src.css), createDefaultCSS())
)

const stubJS = (answers, config) => (
  forceWriteFile(fromRoot(config.src.js), createDefaultJS())
)

const stubConfiguration = (answers, config) => (
  forceWriteFile(fromRoot('pinto.config.json'), JSON.stringify(config, null, 2))
)

const init = () => (
  inquirer.prompt([
    {
      type: 'input',
      message: 'package name',
      name: 'packageName',
      default: 'my-project',
    },
    {
      type: 'input',
      message: 'port',
      name: 'port',
      default: 3000,
    },
    {
      type: 'confirm',
      message: 'include template data',
      name: 'useTemplateData',
    },
    // check if this is ok to build
  ]).then(answers => {
    const config = deepmerge({}, defaultConfig, {})

    // console.log('create package.json')
    // console.log('create config')
    // console.log('stub html')
    // console.log('stub css')
    // console.log('stub js')
    // console.log('stub templateData')

    return Promise.all([
      stubHtml(answers, defaultConfig),
      stubCSS(answers, defaultConfig),
      stubJS(answers, defaultConfig),
      stubTemplateData(answers, defaultConfig)
      stubConfiguration(answers, defaultConfig),
    ])
  })
)

module.exports = init
