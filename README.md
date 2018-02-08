# pinto

A minimal build and dev tool for really tiny HTML projects.

For example, sometimes I want a single page with a tiny bit of CSS and JS, but I still want to transpile the JS, autoprefix the css, and minify the HTML.

## what it does

Pinto creates a completely static html page from the following:

* an HTML file
* a single CSS file
* a single JS file
* a template data file

The HTML is treated as a mustache template, which recieves 
the template data and the transformed css and js.

## why not webpack

Sometimes I want something less intense, and for really small things I can get away with something small and fast.

## installation

```bash
npm install pinto --save-dev
```

## usage

Add something like the following to your `package.json`

```json
{
  "scripts": {
    "dev": "pinto dev",
    "build": "NODE_ENV=production pinto build"
  }
}
```

Then create `src/index.html`

```html
<html>
  <head>
    <title>My super cool page!</title>
    <style type="text/css">{{{css}}}</style>
  </head>
  <body>
    <script type="text/javascript">{{{js}}}</script>
  </body>
</html>
```

Then create `src/index.css`

```html
body {
  border: 1px solid red;
}
```

Then create `src/index.js`

```html
const hello = () => 'hello'
console.log(hello())
```

_NOTE_ `"NODE_ENV=production` is what triggers minification.

## configuration
`pinto.config.js`

This is what the defaults are set too

```javascript
module.exports = {
  port: 3000,
  dist: 'dist',
  output: 'index.html',
  templateData: 'src/templateData.js',
  src: {
    html: 'src/index.html',
    css: 'src/index.css',
    js: 'src/index.js',
  },
}
```
