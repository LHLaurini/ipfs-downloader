var browserify = require('browserify');
var tsify = require('tsify');
var tinyify = require('tinyify');

browserify()
    .add('src/index.ts')
    .plugin(tsify, { noImplicitAny: true })
    .plugin(tinyify)
    .bundle()
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(process.stdout);
