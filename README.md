# pinto

A minimal build and dev tool for really tiny HTML projects.

For example, sometimes I want a single page with a tiny bit of CSS and JS, but I still want to transpile the JS, autoprefix the css, and minify the HTML.

## quick start

```
$ npx pinto init  # scaffolds the project
$ npx pinto dev   # starts a dev server
$ npx pinto build # builds a static page
```

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
$ npm install pinto --save-dev
```

## usage

Assuming you use the default configuration...

Your project folder might look like

```
package.json
src/
  index.html
  index.css
  index.js
  templateData.js
```

...and assuming the following is the content of those files:

#### `package.json`
```json
{
  "name": "my-cool-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "pinto dev",
    "build": "NODE_ENV=production pinto build"
  },
  "dependencies": {
    "pinto": "^1.0.0"
  }
}
```

#### `src/index.html`
```mustache
<!DOCTYPE html>
<html>
  <head>
    <title>{{data.title}}</title>
    <style type="text/css">{{{css}}}</style>
  </head>
  <body>
    <h1>{{data.heading}}</h1>
    <script type="text/javascript">{{{js}}}</script>
  </body>
</html>
```

#### `src/templateData.js`
```js
module.exports = {
  title: 'My super cool page!',
  heading: 'Howdy',
}
```

#### `src/index.css`
```css
h1 {
  color: red;
}
```

#### `src/index.js`
```javascript
const hello = () => 'hello'
console.log(hello())
```

...you could run:

```bash
$ npm run build
```

...and you would get a new file `dist/index.html` that looks like:

```html
<!DOCTYPE html> <html> <head> <title>My super cool page!</title> <style type="text/css">body{border:1px solid red}</style> </head> <body> <h1>Howdy</h1> <script type="text/javascript">var hello=function(){return"hello"};console.log(hello());</script> </body> </html> 
```


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
