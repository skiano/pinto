const fs = require('fs-extra')
const path = require('path')

exports.projectRoot = process.cwd()

exports.fromRoot = (p) => path.resolve(exports.projectRoot, p)

exports.forceWriteFile = (file, content) => (
  fs.ensureFile(file).then(() => (
    fs.writeFile(file, content)
  ))
)

exports.defaultConfig = {
  port: 3000,
  dist: "dist",
  output: "index.html",
  src: {
    data: "src/data.js",
    html: "src/index.html",
    css: "src/index.css",
    js: "src/index.js"
  }
}

exports.createDefaultHTML = (data) => `<!DOCTYPE html>
<html>
  <head>
    <title>${data.useData ? '{{title}}' : data.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta charSet="utf-8"/>
    {{css}}
  </head>
  <body>
    <h1>${data.useData ? '{{title}}' : data.title}</h1>
    {{js}}
  </body>
</html>
`

exports.createDefaultCSS = (data) => `h1 { color: red; }`
exports.createDefaultJS = (data) => `console.log('hello page!')`
