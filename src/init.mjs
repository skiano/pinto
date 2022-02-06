import path from 'path';

import { 
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
      forceWriteFile(path.resolve(ASSETS_DIRECTORY, 'example.svg'), EXAMPLE_SVG),
      forceWriteFile(path.resolve(BASE_DIRECTORY, 'app.js'), EXAMPLE_JS),
      forceWriteFile(path.resolve(BASE_DIRECTORY, 'data.json'), JSON.stringify(EXAMPLE_DATA, null, 2)),
      forceWriteFile(path.resolve(BASE_DIRECTORY, 'style.css'), EXAMPLE_CSS),
      forceWriteFile(path.resolve(BASE_DIRECTORY, 'index.handlebars'), EXAMPLE_HTML),
    ]);
  } catch (e) {
    console.error(e);
  }
})();
