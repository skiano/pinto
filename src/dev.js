const path = require('path')
const http = require('http')
const connect = require('connect')
const serveStatic = require('serve-static')
const build = require('./build')

const createDevServer = (config) => {
  const app = connect()

  app.use(serveStatic(config.dist, { extensions: ['html'] }))

  http.createServer(app).listen(config.port, () => {
    console.log(`serving http://localhost:${config.port}`)
  })
}

const dev = (config) => {
  // 1. setup a watcher
  const watcher = require('chokidar').watch(config.root, {
    ignored: [
      /(^|[\/\\])\../,
      path.resolve(config.root, 'node_modules/**/*'),
      path.resolve(config.dist, '**/*'),
    ]
  })

  // 2. when it is ready tie it to the build
  watcher.on('ready', () => { watcher.on('all', () => build(config)) })

  // 3. perform initial build
  build(config)

  // 4. serve the build from dist
  createDevServer(config)
}

module.exports = dev
