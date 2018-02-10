const fs = require('fs-extra')
const path = require('path')
const deepmerge = require('deepmerge')

exports.configFile = 'pinto.config'
exports.projectRoot = process.cwd()

exports.fromRoot = (p) => path.resolve(exports.projectRoot, p)
exports.fromSrc = (p) => path.resolve(exports.projectRoot, 'src', p)

exports.loadConfig = () => {
  const c = require(path.resolve(exports.projectRoot, exports.configFile))

  c.dist = exports.fromRoot(c.dist)
  c.srcFolder = exports.fromRoot('src')
  c.output = path.resolve(c.dist, c.output)

  c.src.html = exports.fromSrc(c.src.html)
  c.src.css = exports.fromSrc(c.src.css)
  c.src.js = exports.fromSrc(c.src.js)

  c.src.data = c.src.data && exports.fromSrc(c.src.data)

  return c
}

exports.transformFile = (file, transformer = i => i, optimize) => (
  fs.readFile(file).then((c) => transformer(c.toString(), optimize))
)

exports.forceWriteFile = (file, content) => (
  fs.ensureFile(file).then(() => (
    fs.writeFile(file, content)
  ))
)

exports.createConfig = (config) => ({
  port: parseInt(config.port),
  dist: "dist",
  output: "index.html",
  src: {
    data: config.useData ? "data.js" : null,
    html: "index.html",
    css: "index.css",
    js: "index.js"
  }
})

exports.createDefaultHTML = (config) => `<!DOCTYPE html>
<html>
  <head>
    <title>${config.useData ? '{{data.title}}' : 'Hello Pinto'}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta charSet="utf-8"/>
    <style>{{css}}</style>
  </head>
  <body>
    <h1>${config.useData ? '{{data.heading}}' : 'Hello Pinto'}</h1>
    <script type="text/javascript">{{js}}</script>
  </body>
</html>
`

exports.createDefaultCSS = (data) => `h1 { color: red; }`
exports.createDefaultJS = (data) => `console.log('hello page!')`
