# pinto

[![npm version](https://badge.fury.io/js/pinto.svg)](https://badge.fury.io/js/pinto)

## what is it?

A minimal and zero-configuration tool for developing super tiny HTML projects, such as:

* **quick experiments and prototypes** _— it’s easy to build and deploy_
* **student projects** _— the environment is almost non-existent_
* **super small sites** _— single page portfolio etc_
* **project documentation** _— by using pinto on your gh-pages branch_

## how do I use it?

```bash
$ npm install pinto -g # install the cli
```

```bash
$ pinto init src        # scaffolds the project in src/ folder
$ pinto dev src         # starts a dev src/
$ pinto build src dist  # builds a static page in dist
$ pinto preview dist    # previews the static page in dist
```

## what it does?

Pinto creates a completely static html page from the following:

* A single CSS file
* A single JS file
* A handlebars template
* A JSON file that powers the handlebars template
* An assets folder for public images or whatever
