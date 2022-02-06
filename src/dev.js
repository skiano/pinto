console.log('imported dev')

// const fs = require('fs-extra')
// const http = require('http')
// const chalk = require('chalk')
// const connect = require('connect')
// const serveStatic = require('serve-static')
// const ConvertAnsi = require('ansi-to-html')
// const transformJS = require('./transformJS')
// const transformCSS = require('./transformCSS')
// const transformHTML = require('./transformHTML')
// const { loadConfig, transformFile, createTemplateData } = require('./util.mjs')

// const convertAnsi = new ConvertAnsi();

// const PAGE = {
//   error: undefined,
//   html: '',
//   css: '',
//   js: '',
//   data: {},
// }
// const updateHTML = f => transformFile(f).then(html => PAGE.html = html)
// const updateDATA = f => transformFile(f, JSON.parse).then(data => PAGE.data = data)
// const updateCSS = f => transformFile(f, transformCSS).then(css => PAGE.css = css)
// const updateJS = f => transformFile(f, transformJS).then(js => PAGE.js = js)

// const createServer = (config) => {
//   const app = connect()

//   // serve static assets
//   app.use(`/${config.staticRoute}`, serveStatic(config.src.static))

//   // serve rendered page
//   app.use((req, res) => {
//     res.setHeader('Content-Type', 'text/html')
//     res.setHeader('X-Powered-By', 'pinto')

//     if (PAGE.error) {
//       // TODO handle different errors in a more helpful way
//       res.write(`<pre>BUILD ERROR\n${convertAnsi.toHtml(PAGE.error.message)}\n${convertAnsi.toHtml(PAGE.error.stack)}</pre>`)
//     } else {
//       res.write(transformHTML(PAGE.html, createTemplateData(config, PAGE.css, PAGE.js, PAGE.data)))
//     }

//     res.end()
//   })

//   http.createServer(app).listen(config.port, () => {
//     console.log(`serving`, chalk.green(`http://localhost:${config.port}`))
//   })
// }

// const dev = () => {
//   const config = loadConfig()
//   const watcher = require('chokidar').watch(config.srcFolder)

//   const update = ((file) => {
//     switch (true) {
//       case file === config.src.js: return updateJS(file)
//       case file === config.src.css: return updateCSS(file)
//       case file === config.src.html: return updateHTML(file)
//       case file === config.src.data: return updateDATA(file)
//       default: return Promise.resolve()
//     }
//   })

//   watcher.on('ready', () => {
//     watcher.on('all', (_, file) => {
//       // clear any errors
//       PAGE.error = undefined

//       const start = Date.now()
//       update(file).then(() => {
//         console.log('updated', chalk.cyan(`${Date.now() - start}ms`))
//       }).catch((err) => {
//         PAGE.error = err
//         console.log(chalk.red(err))
//       })
//     })
//   })

//   const start = Date.now()
//   Promise.all([
//     updateJS(config.src.js),
//     updateCSS(config.src.css),
//     updateHTML(config.src.html),
//     updateDATA(config.src.data),
//   ]).then(() => {
//     console.log('initial build', chalk.cyan(`${Date.now() - start}ms`))
//     createServer(config)
//   }).catch(err => {
//     PAGE.error = err
//     console.log(chalk.red(err))
//     createServer(config)
//   })
// }

// module.exports = dev
