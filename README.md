# pinto

A minimal build and dev tool for really tiny HTML projects.

It’s somewhere between a JS fiddle and a mini static site generator.

## why not webpack

I just want less, and for really small things I can get away with it.

## quick start

```
$ npx pinto init  # scaffolds the project
$ npx pinto dev   # starts a dev server
$ npx pinto build # builds a static page
```

By default, pinto applies optimizations only on build, but you can override that.

```
$ npx pinto dev --optimize
$ npx pinto build --optimize=false
```

If you want, you can use the excellent [`now`](https://zeit.co/now) to share your project with the world!

```
$ npx pinto build && cd dist && npx now
```

## what it does

Pinto creates a completely static html page from the following:

* an HTML file
* a single CSS file
* a single JS file
* a template data file

The HTML is treated as a mustache template, which recieves 
the template data and the transformed css and js.

## in detail

Given the following:

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

#### `src/data.js`
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
$ npx pinto build
```

...and you would get a new file `dist/index.html` that looks like:

```html
<!DOCTYPE html> <html> <head> <title>My super cool page!</title> <style type="text/css">body{border:1px solid red}</style> </head> <body> <h1>Howdy</h1> <script type="text/javascript">var hello=function(){return"hello"};console.log(hello());</script> </body> </html> 
```
