const buble = require('buble')
const { args } = require('./util')

module.exports = function transformJS(input, optimize) {
  let output = buble.transform(input).code
  if (!args.optimize) return output
  output = require("uglify-js").minify(output)
  if (output.error) throw new Error(output.error)
  return output.code
}
