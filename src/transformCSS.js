const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const { args } = require('./util')

const nano = require('cssnano')({
  preset: 'default',
})

const prefixer = autoprefixer({
  browsers: [
    "> 1%",
    "last 2 versions",
    "not ie <= 9"
  ]
})

module.exports = function createCSS(input) {
  const plugins = [prefixer]
  if (args.optimize) plugins.push(nano)
  return postcss(plugins)
    .process(input, { from: undefined })
    .then(({ css }) => css)
}
