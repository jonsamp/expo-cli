#!/usr/bin/env node
'use strict';

// validate that used node version is supported
var semver = require('semver');
var ver = process.versions.node;
ver = ver.split('-')[0]; // explode and truncate tag from version

if (semver.satisfies(ver, '>=6.0.0')) {
  if (process.env.EXPO_DEBUG === 'true') {
    require('source-map-support').install();
  }
  require('../build/exp.js').run('expo');
} else {
  console.log(
    require('chalk').red(
      'Node version ' + ver + ' is not supported, please use Node.js 6.0 or higher.'
    )
  );
  process.exit(1);
}
