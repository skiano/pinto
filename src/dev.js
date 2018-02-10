const fs = require('fs-extra')
const http = require('http')
const chalk = require('chalk')
const connect = require('connect')
const ConvertAnsi = require('ansi-to-html')
const transformJS = require('./transformJS')
const transformCSS = require('./transformCSS')
const transformHTML = require('./transformHTML')
const { loadConfig, transformFile } = require('./util')

const convertAnsi = new ConvertAnsi();

const PAGE = {
  error: undefined,
  html: '',
  data: { data: {}, css: '', js: '' },
}
const updateHTML = f => transformFile(f).then(html => PAGE.html = html)
const updateDATA = f => transformFile(f, JSON.parse).then(data => PAGE.data.data = data)
const updateCSS = f => transformFile(f, transformCSS).then(css => PAGE.data.css = css)
const updateJS = f => transformFile(f, transformJS).then(js => PAGE.data.js = js)

const createServer = (config) => {
  const app = connect()

  app.use((req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('X-Powered-By', 'pinto')

    if (PAGE.error) {
      // TODO handle different errors in a more helpful way
      res.write(`<pre>BUILD ERROR\n${convertAnsi.toHtml(PAGE.error.message)}\n${convertAnsi.toHtml(PAGE.error.stack)}</pre>`)
    } else {
      res.write(transformHTML(PAGE.html, PAGE.data))
    }

    res.end()
  })

  http.createServer(app).listen(config.port, () => {
    console.log(`serving`, chalk.green(`http://localhost:${config.port}`))
  })
}

const dev = () => {
  const config = loadConfig()
  const watcher = require('chokidar').watch(config.srcFolder)

  const update = ((file) => {
    switch (true) {
      case file === config.src.js: return updateJS(file)
      case file === config.src.css: return updateCSS(file)
      case file === config.src.html: return updateHTML(file)
      case file === config.src.data: return updateDATA(file)
      default: return Promise.resolve()
    }
  })

  watcher.on('ready', () => {
    watcher.on('all', (_, file) => {
      // clear any errors
      PAGE.error = undefined

      const start = Date.now()
      update(file).then(() => {
        console.log('updated', chalk.cyan(`${Date.now() - start}ms`))
      }).catch((err) => {
        PAGE.error = err
        console.log(chalk.red(err))
      })
    })
  })

  const start = Date.now()
  Promise.all([
    updateJS(config.src.js),
    updateCSS(config.src.css),
    updateHTML(config.src.html),
    updateDATA(config.src.data),
  ]).then(() => {
    console.log('initial build', chalk.cyan(`${Date.now() - start}ms`))
    createServer(config)
  }).catch(err => {
    PAGE.error = err
    console.log(chalk.red(err))
    createServer(config)
  })
}

module.exports = dev
