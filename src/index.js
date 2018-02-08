const fs = require('fs')
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

const build = () => {
  const start = new Date()

  Promise.all([
    readFile('./src/index.html'),
    readFile('./src/index.css'),
    readFile('./src/index.js'),
  ]).then(([html, rawCss, rawJs]) => (
    Promise.all([
      createCss(rawCss),
      createJs(rawJs),
    ]).then(([css, js]) => (
      writeFile('index.html', createHTML(html, {
        js,
        css,
        projects: require('./src/projects')
      }))
    ))
  )).then(() => {
    console.log(`Build: ${new Date() - start}ms`)
  }).catch(err => {
    console.error(err)
  })
}

if (IS_PROD) {
  build()
} else {
  const watcher = require('chokidar').watch('./src')
  watcher.on('ready', () => { watcher.on('all', build) })
  const server = require('serve')(__dirname, {
    port: 3000,
  })
}
