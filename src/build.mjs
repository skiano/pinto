import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import postcss from 'postcss';
import cssnano from 'cssnano';
import Handlebars from 'handlebars';
import autoprefixer from 'autoprefixer';
import { minify as minifyHtml } from 'html-minifier';
import { minify as minifyJs } from "terser";

import {
  readFile,
  forceWriteFile,
  JS_FILE,
  CSS_FILE,
  HTML_FILE,
  JSON_FILE,
  ASSETS_DIRECTORY,
  OUTPUT_DIRECTORY,
  OUTPUT_ASSETS_DIRECTORY
} from './util.mjs';

(async () => {
  const [js, css, html, json] = await Promise.all([
    readFile(JS_FILE).then(async (input) => {
      const { code } = await minifyJs(input, { toplevel: true });
      return code;
    }),
    readFile(CSS_FILE).then(async (input) => {
      const { css } = await postcss([autoprefixer(), cssnano()]).process(input, { from: CSS_FILE });
      return css;
    }),
    readFile(HTML_FILE).then(Handlebars.compile),
    readFile(JSON_FILE).then(JSON.parse),
  ]);

  const indexHtml = minifyHtml(html({...json, pinto: { css, js }}), {
    collapseWhitespace: true,
    conservativeCollapse: true,
    quoteCharacter: '"',
    removeComments: true,
  });

  await fs.emptyDir(OUTPUT_DIRECTORY);
  await fs.copy(ASSETS_DIRECTORY, OUTPUT_ASSETS_DIRECTORY);
  await forceWriteFile(path.resolve(OUTPUT_DIRECTORY, 'index.html'), indexHtml);
  console.log(chalk.green(`PINTO BUILD: ${OUTPUT_DIRECTORY}`));
})();
