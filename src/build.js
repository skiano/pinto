const fs = require('fs')
const chalk = require('chalk')
const buble = require('buble')
const hogan = require("hogan.js")
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const { promisify } = require('es6-promisify')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const IS_PROD = process.env.NODE_ENV === 'production'

const nano = IS_PROD && require('cssnano')({
  preset: 'default',
})

const prefixer = autoprefixer({
  browsers: [
    "> 1%",
    "last 2 versions",
    "not ie <= 9"
  ]
})

const createCss = (input) => {
  if (!IS_PROD) return input

  const plugins = [prefixer, nano].filter(_ => _)

  return postcss(plugins)
    .process(input, { from: undefined })
    .then(({ css }) => css)
}

const createJs = (input) => {
  let output = buble.transform(input.toString()).code

  if (!IS_PROD) return output

  output = require("uglify-js").minify(output)
  if (output.error) throw new Error(output.error)
  return output.code
}

const createHTML = (html, data) => {
  const template = hogan.compile(html.toString())
  const output = template.render(data)

  if (!IS_PROD) return output

  return require('html-minifier').minify(output, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    quoteCharacter: '"',
    removeComments: true,
  })
}

const createData = (data) => (typeof data === 'function')
  ? data
  : () => data

const build = (config) => {
  const start = new Date()

  return Promise.all([
    readFile(config.src.html),
    readFile(config.src.css),
    readFile(config.src.js),
  ]).then(([html, rawCss, rawJs]) => (
    Promise.all([
      createCss(rawCss),
      createJs(rawJs),
    ]).then(([css, js]) => (
      Promise.resolve(createData(config.templateData)).then(data => (
        writeFile(config.output, createHTML(html, {
          js,
          css,
          data,
        }))
      ))
    ))
  )).then(() => {
    console.log('built', chalk.cyan(`${new Date() - start}ms`))
  }).catch(err => {
    console.error(err)
  })
}

module.exports = build
