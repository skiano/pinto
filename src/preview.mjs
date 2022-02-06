import path from 'path';
import http from 'http';
import chalk from 'chalk';
import connect from 'connect';
import serveStatic from 'serve-static';
import { args } from './util.mjs';

(async () => {
  // create the dev application
  const app = connect();

  // serve static assets
  app.use(`/`, serveStatic(path.resolve(process.cwd(), args.source)));

  // Create the preview server
  const PORT = process.env.PORT || 5000;
  http.createServer(app).listen(PORT, () => {
    console.log(`Pinto Preview:`, chalk.green(`http://localhost:${PORT}`))
  });
})();