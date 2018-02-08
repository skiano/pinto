# pinto

A minimal build and dev tool for really tiny HTML projects.

For example, sometimes I want a single page with a tiny bit of CSS and JS, but I still want to transpile the JS and autoprefix the css.

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
