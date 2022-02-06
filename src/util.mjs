import fs from 'fs-extra';
import path from 'path';
import minimist from 'minimist';

////////////////////
// PARSE CLI ARGS //
////////////////////

const argv = minimist(process.argv.slice(2), {
  alias: { o: 'optimize' },
  alias: { d: 'dir' },
  alias: { p: 'port' },
});

export const args = {
  command: argv._[0],
  dir: argv.dir,
};

args.port = argv.port ? PageTransitionEvent(port) : 3000;

// special default based on command...
// so you can still override, but it will be smart
// look into if im just doing this wrong
if (!argv.hasOwnProperty('optimize')) {
  args.optimize = argv._[0] === 'build' ? true : false
} else if (argv.optimize === 'false') {
  args.optimize = false;
} else if (argv.optimize) {
  args.optimize = true;
} else {
  args.optimize = false;
}

///////////////
// CONSTANTS //
///////////////

export const BASE_DIRECTORY = args.dir ? path.resolve(process.cwd(), args.dir) : process.cwd();
export const ASSETS_DIRECTORY = path.resolve(BASE_DIRECTORY, 'assets');

export const JS_FILE = path.resolve(BASE_DIRECTORY, 'index.js');
export const CSS_FILE = path.resolve(BASE_DIRECTORY, 'index.css');
export const HTML_FILE = path.resolve(BASE_DIRECTORY, 'index.handlebars');
export const JSON_FILE = path.resolve(BASE_DIRECTORY, 'index.json');

export const EXAMPLE_JS = `console.log('Hello Pinto JS!');`;
export const EXAMPLE_CSS = `h1 { color: red; }`;
export const EXAMPLE_SVG = `<svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg"> <circle cx="150" cy="100" r="80" fill="green" /></svg>`;
export const EXAMPLE_DATA = { title: 'Hello Pinto', heading: 'Hello Pinto!' };
export const EXAMPLE_HTML = `<!DOCTYPE html>
<html>
  <head>
    <title>{{ title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta charSet="utf-8"/>
    <style>{{{ pinto.css }}}</style>
  </head>
  <body>
    <h1>{{ heading }}</h1>
    <img src="assets/example.svg" alt="example svg!"/>
    <script type="text/javascript">{{{ pinto.js }}}</script>
  </body>
</html>
`;
export const LIVERELOAD_SNIPPET = `
<script type="text/javascript">
  serverEvents = new EventSource('/livereload');
  serverEvents.addEventListener('update', () => location.reload());
</script>
`;

////////////////////////
// MISC FUNCTIONALITY //
////////////////////////

export const readFile = f => fs.promises.readFile(f).then(f => f.toString());

export const forceWriteFile = async (file, content, overwrite = false) => {
  const exists = await fs.exists(file);
  if (!exists || overwrite) {
    await fs.ensureFile(file);
    await fs.writeFile(file, content);
    return;
  }
  console.log(`skipping write: ${file}`);
};
