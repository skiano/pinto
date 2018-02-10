const hogan = require('hogan.js')

module.exports = function createHTML(html, data, optimize) {
  const template = hogan.compile(html)
  const output = template.render(data)

  if (!optimize) return output

  return require('html-minifier').minify(output, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    quoteCharacter: '"',
    removeComments: true,
  })
}
