const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

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

module.exports = function createCSS(input, optimize) {
  const plugins = [prefixer]
  if (optimize) plugins.push(nano)
  return postcss(plugins)
    .process(input, { from: undefined })
    .then(({ css }) => css)
}
