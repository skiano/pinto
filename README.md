# pinto

[![npm version](https://badge.fury.io/js/pinto.svg)](https://badge.fury.io/js/pinto) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## what is it?

A minimal tool for developing super tiny HTML projects, such as:

* **quick experiments and prototypes** _— it’s easy to build and deploy_
* **student projects** _— the environment is simple, but supports es6 and autoprefixing_
* **super small sites** _— single-page portfolio or marketing pages, etc_

_When you could live with a single html, css, and js file, but you still want minified and transformed code, pinto might be a good fit._

## is it just webpack boilerplate?

No. While I think webpack is an obvious choice for many projects, this is less ambitious and focuses on smaller use-cases. I tried to [keep the dependencies very lean](https://github.com/skiano/pinto/blob/master/package.json).

If you are interested in a nice layer on top of webpack, there are already great projects, such as [poi](https://poi.js.org/#/) and [neutrino](https://neutrino.js.org/) you could use.

## why not webpack?

I just want less, and for really small things I can get away with it. Plus it's fast :)

## how do I use it?

The easiest way is [`npx`](https://www.npmjs.com/package/npx) because it comes with `npm`.

```bash
$ npx pinto init  # scaffolds the project in current directory
$ npx pinto dev   # starts a dev server
$ npx pinto build # builds a static page
```

By default, pinto applies optimizations only on build, but you can override that.

```bash
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

[What exactly does scaffolding create?](docs/SCAFFOLDING.md)

## what about 3rd party code?

Because you are limited to one JS file, you cannot import any 3rd party code into the bundle.
But you control the HTML, so you can simply include a CDN link for most libraries (see [cdnjs.com](https://cdnjs.com/) or [unpkg.com](https://unpkg.com)).

If you need something more sophisticated, you probably want a more sophisticated tool, such as webpack or parcel.

On the other hand, if your concern is creating a totally isolated page (archival), consider copying the vendor code to your static folder and loading it via a script tag. (static folders are not supprted yet. [see #2](https://github.com/skiano/pinto/issues/2))

## what about jsx...
