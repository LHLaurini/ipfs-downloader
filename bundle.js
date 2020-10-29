var browserify = require('browserify');
var tsify = require('tsify');

browserify()
    .add('src/index.ts')
    .plugin(tsify, { noImplicitAny: true })
    .bundle()
    .on('error', function (error) { console.error(error.toString()); })
    .pipe(process.stdout);
