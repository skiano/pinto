import http from 'http';
import chalk from 'chalk';
import connect from 'connect';
import chokidar from 'chokidar';
import AnsiToHtml from 'ansi-to-html';
import Handlebars from 'handlebars';
import serveStatic from 'serve-static';
import {
  args,
  readFile,
  JS_FILE,
  CSS_FILE,
  HTML_FILE,
  JSON_FILE,
  ASSETS_DIRECTORY,
} from './util.mjs';

const convertAnsi = new AnsiToHtml();

(async () => {
  ////////////////////
  // DEV STATE MGMT //
  ////////////////////

  const STATE = {
    js: '',
    css: '',
    data: {},
    html: () => '',
    error: null,
  };

  const TRANSFORMS = {
    [JS_FILE]: () => readFile(JS_FILE).then(o => STATE.js = o),
    [CSS_FILE]: () => readFile(CSS_FILE).then(o => STATE.css = o),
    [JSON_FILE]: () => readFile(JSON_FILE).then(o => STATE.data = JSON.parse(o)),
    [HTML_FILE]: () => readFile(HTML_FILE).then(o => { 
      // console.log(Handlebars.compile(o)({ title: 'hello there' }));
      STATE.html = Handlebars.compile(o)
    }),
  };

  const watcher = chokidar.watch(Object.keys(TRANSFORMS));

  watcher.on('ready', () => {
    watcher.on('all', async (_, file) => {
      try {
        const start = Date.now();

        // clear any errors
        STATE.error = undefined;
  
        // update in memory version
        await TRANSFORMS[file]();
  
        // report on time
        console.log('updated', chalk.cyan(`${Date.now() - start}ms`));
      } catch (e) {
        STATE.error = e;
        console.log(chalk.red(e));
      }
    });
  });

  // Initial transforms...
  try {
    await Promise.all(Object.values(TRANSFORMS).map(f => f()));
  } catch (e) {
    STATE.error = e;
    console.log(chalk.red('FAILED TO SETUP STATE'));
    console.error(e);
  }

  ////////////////
  // DEV SERVER //
  ////////////////

  const app = connect()

  // serve static assets
  app.use(`/assets`, serveStatic(ASSETS_DIRECTORY));

  // serve rendered page
  app.use((req, res, next) => {
    if (req.url !== '/') return next();
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Powered-By', 'pinto');

    if (STATE.error) {
      res.write(`<pre>BUILD ERROR\n${convertAnsi.toHtml(STATE.error.message)}\n${convertAnsi.toHtml(STATE.error.stack)}</pre>`);
    } else {
      console.log('render template');
      res.write(STATE.html({
        ...STATE.data,
        pinto: { css: STATE.css, js: STATE.js },
      }));
    }

    res.end();
  });

  http.createServer(app).listen(args.port, () => {
    console.log(`Pinto serving:`, chalk.green(`http://localhost:${args.port}`))
  });
})();