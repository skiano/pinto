const path = require('path')
const http = require('http')
const chalk = require('chalk')
const connect = require('connect')
const serveStatic = require('serve-static')
const build = require('./build')

const createDevServer = (config) => {
  const app = connect()

  app.use(serveStatic(config.dist, { extensions: ['html'] }))

  http.createServer(app).listen(config.port, () => {
    console.log(`serving`, chalk.green(`http://localhost:${config.port}`))
  })
}

const dev = (config) => {
  const watcher = require('chokidar').watch(config.root, {
    ignored: [
      /(^|[\/\\])\../,
      path.resolve(config.root, 'node_modules/**/*'),
      path.resolve(config.dist, '**/*'),
    ]
  })

  watcher.on('ready', () => { watcher.on('all', () => build(config)) })

  build(config).then(() => createDevServer(config))
}

module.exports = dev
