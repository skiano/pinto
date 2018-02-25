const fs = require('fs-extra')
const path = require('path')
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2), {
  alias: { o: 'optimize' },
})

const args = { command: argv._[0] }

// special default based on command...
// so you can still override, but it will be smart
// look into if im just doing this wrong
if (!argv.hasOwnProperty('optimize')) {
  args.optimize = argv._[0] === 'build' ? true : false
} else if (argv.optimize === 'false') {
  args.optimize = false
} else if (argv.optimize) {
  args.optimize = true
} else {
  args.optimize = false
}

exports.args = args

exports.configFile = 'pinto.config'
exports.projectRoot = process.cwd()

exports.fromRoot = (p) => path.resolve(exports.projectRoot, p)
exports.fromSrc = (p) => path.resolve(exports.projectRoot, 'src', p)

exports.createConfig = (config) => ({
  port: parseInt(config.port),
  dist: "dist",
  output: "index.html",
  src: {
    static: "static",
    data: config.useData ? "data.json" : null,
    html: "index.html",
    css: "index.css",
    js: "index.js"
  }
})

exports.loadConfig = () => {
  const c = require(path.resolve(exports.projectRoot, exports.configFile))

  c.dist = exports.fromRoot(c.dist)
  c.srcFolder = exports.fromRoot('src')
  c.output = path.resolve(c.dist, c.output)

  c.staticRoute = c.src.static
  c.src.static = exports.fromSrc(c.src.static)
  c.src.html = exports.fromSrc(c.src.html)
  c.src.css = exports.fromSrc(c.src.css)
  c.src.js = exports.fromSrc(c.src.js)

  c.src.data = c.src.data && exports.fromSrc(c.src.data)

  return c
}

exports.transformFile = (file, transformer = i => i, optimize) => (
  fs.readFile(file).then((c) => transformer(c.toString(), optimize))
)

exports.forceWriteFile = (file, content, overwrite = false) => (
  fs.exists(file).then((exists) => {
    const shouldWrite = !exists || overwrite
    if (!shouldWrite) {
      console.log(`skipping write: ${file}`)
    }
    return shouldWrite && fs.ensureFile(file).then(() => (
      fs.writeFile(file, content)
    ))
  })
)

exports.createTemplateData = (css, js, data) => (Object.assign({
  pinto: { css, js },
}, data))

exports.createDefaultHTML = (config) => `<!DOCTYPE html>
<html>
  <head>
    <title>${config.src.data ? '{{title}}' : 'Hello Pinto'}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta charSet="utf-8"/>
    <style>{{{pinto.css}}}</style>
  </head>
  <body>
    <h1>${config.src.data ? '{{heading}}' : 'Hello Pinto'}</h1>
    <script type="text/javascript">{{{pinto.js}}}</script>
  </body>
</html>
`

exports.createDefaultCSS = (data) => `h1 { color: red; }`
exports.createDefaultJS = (data) => `console.log('hello page!')`
