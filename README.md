# pinto

[![npm version](https://badge.fury.io/js/pinto.svg)](https://badge.fury.io/js/pinto)

## what is it?

A minimal build and dev tool for really tiny HTML projects, such as:

* quick experiments or prototypes (easy to build and deploy)
* student projects (simple environment that supports es6 and autoprefixing)
* super small sites (portfolio pages, one-off marketing pages, etc)

Basically, anywhere where you could get away with an single html, css, and js file, but you still want minified and transformed code.

## why not webpack?

I just want less, and for really small things I can get away with it. Plus its fast :)

## how do I use it?

The easiest way is [`npx`](https://www.npmjs.com/package/npx) because it comes with `npm`.

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

## what it does?

Pinto creates a completely static html page from the following:

* an HTML file
* a single CSS file
* a single JS file
* a template data file

The HTML is treated as a mustache template, which recieves
the template data and the transformed css and js.

## what does scaffolding create?

Scaffolding your project will create something like the following

```jsx
***************************************
src/data.json
***************************************

    {
      "title": "My super cool page!",
      "heading": "Howdy"
    }

***************************************
src/index.css
***************************************

    h1 {
      color: red;
    }

***************************************
src/index.js
***************************************

    const hello = () => 'hello'
    console.log(hello())
    
***************************************
src/index.html
***************************************

    <!DOCTYPE html>
    <html>
      <head>
        <title>{{data.title}}</title>
        <style>{{{css}}}</style>
      </head>
      <body>
        <h1>{{data.heading}}</h1>
        <script type="text/javascript">{{{js}}}</script>
      </body>
    </html>
```

And `npx pinto build` would create a new file `dist/index.html` that looks like:

```html
<!DOCTYPE html> <html> <head> <title>My super cool page!</title> <style type="text/css">body{border:1px solid red}</style> </head> <body> <h1>Howdy</h1> <script type="text/javascript">var hello=function(){return"hello"};console.log(hello());</script> </body> </html>
```

## What about 3rd party code?

Because you are limited to one JS file, you cannot import any 3rd party code into the bundle.
But you control the HTML, so you can simply include a CDN link for most libraries (see [cdnjs.com](https://cdnjs.com/) or [unpkg.com](https://unpkg.com)).

If you need something more sophisticated, you probably want a more sophisticated tool, such as webpack or parcel.

On the other hand, if your concern is creating a totally isolated page (archival), consider copying the vendor code to your static folder and loading it via a script tag. (static folders are not supprted yet. see #2)

## What about jsx...
