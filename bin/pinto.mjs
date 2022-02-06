#! /usr/bin/env node
import { args } from '../src/util.mjs';

switch (args.command) {
  case 'build':
    import('../src/build.mjs');
    break;
  case 'dev':
    import('../src/dev.mjs');
    break;
  case 'init':
    import('../src/init.mjs');
    break;
  case 'preview':
    import('../src/preview.mjs');
    break;
}

