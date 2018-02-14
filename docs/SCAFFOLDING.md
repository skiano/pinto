#what does scaffolding create?

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

----

[Back to docs](README.md)
