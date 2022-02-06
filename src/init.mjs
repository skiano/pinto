import path from 'path';
import chalk from 'chalk';

import {
  JS_FILE,
  CSS_FILE,
  HTML_FILE,
  JSON_FILE,
  EXAMPLE_JS,
  EXAMPLE_CSS,
  EXAMPLE_SVG,
  EXAMPLE_HTML,
  EXAMPLE_DATA,
  BASE_DIRECTORY,
  ASSETS_DIRECTORY,
  forceWriteFile,
} from './util.mjs';

(async () => {
  try {
    await Promise.all([
      forceWriteFile(JS_FILE, EXAMPLE_JS),
      forceWriteFile(CSS_FILE, EXAMPLE_CSS),
      forceWriteFile(HTML_FILE, EXAMPLE_HTML),
      forceWriteFile(JSON_FILE, JSON.stringify(EXAMPLE_DATA, null, 2)),
      forceWriteFile(path.resolve(ASSETS_DIRECTORY, 'example.svg'), EXAMPLE_SVG),
    ]);
    console.log(chalk.green(`PINTO PROJECT SETUP: ${BASE_DIRECTORY}`));
  } catch (e) {
    console.error(e);
  }
})();
