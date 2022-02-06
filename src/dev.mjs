import http from 'http';
import chalk from 'chalk';
import connect from 'connect';
import chokidar from 'chokidar';
import AnsiToHtml from 'ansi-to-html';
import Handlebars from 'handlebars';
import serveStatic from 'serve-static';
import {
  readFile,
  JS_FILE,
  CSS_FILE,
  HTML_FILE,
  JSON_FILE,
  ASSETS_DIRECTORY,
  LIVERELOAD_SNIPPET,
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
    [HTML_FILE]: () => readFile(HTML_FILE).then(o => STATE.html = Handlebars.compile(o)),
  };

  const livereloadListeners = [];
  const watcher = chokidar.watch(Object.keys(TRANSFORMS));

  watcher.on('ready', () => {
    watcher.on('all', async (_, file) => {
      try {
        const start = Date.now();

        // clear any errors
        STATE.error = undefined;
  
        // update in memory version
        await TRANSFORMS[file]();

        // update browser
        livereloadListeners.forEach(l => l('update', file));

        // report on time
        console.log('updated', chalk.cyan(`${Date.now() - start}ms`));
      } catch (e) {
        STATE.error = e;
        console.log(chalk.red(e));
      }
    });
  });

  // initialize the state
  try {
    await Promise.all(Object.values(TRANSFORMS).map(f => f()));
  } catch (e) {
    STATE.error = e;
    console.log(chalk.red(e));
  }

  ////////////////
  // DEV SERVER //
  ////////////////

  // create the dev application
  const app = connect();

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
      res.write(STATE.html({
        ...STATE.data,
        pinto: { css: STATE.css, js: STATE.js },
      }) + LIVERELOAD_SNIPPET);
    }

    res.end();
  });

  // livereload
  app.use('/livereload', (req, res) => {
    // Open the event stream for livereload
    res.writeHead(200, {
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    });

    // Send an event
    const sendMessage = (channel, data) => {
      res.write(`event: ${channel}\nid: 0\ndata: ${data}\n`);
      res.write(`\n\n`);
    };

    // Send a ping event every minute to prevent console errors
    const ping = setInterval(sendMessage, 60000, 'status', 'ping');

    // Send an initial ack event to stop request pending
    sendMessage('status', 'awaiting change');

    // Subscribe for updates
    livereloadListeners.push(sendMessage);

    // Cleanup subscription and ping interval when user disconnects
    res.on('close', () => {
      livereloadListeners.splice(livereloadListeners.indexOf(sendMessage), 1);
      clearInterval(ping);
    });
  });

  // Create the dev server
  const PORT = process.env.PORT || 3000;
  http.createServer(app).listen(PORT, () => {
    console.log(`Pinto Dev:`, chalk.green(`http://localhost:${PORT}`))
  });
})();