import Handlebars from "handlebars";

// const hogan = require('hogan.js');
// const { args } = require('./util.mjs');

// module.exports = function createHTML(html, data) {
//   const template = hogan.compile(html)
//   const output = template.render(data)

//   if (!args.optimize) return output

//   return require('html-minifier').minify(output, {
//     collapseWhitespace: true,
//     conservativeCollapse: true,
//     quoteCharacter: '"',
//     removeComments: true,
//   });
// };

export default (html, data) => {
  const template = Handlebars.compile(html);
  return template(data);
};
