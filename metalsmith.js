'use strict'

var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var debug = require('metalsmith-debug');

Metalsmith(__dirname)
  .metadata({
    site: {
      title: 'Power of static sites',
      baseurl: 'http://localhost:4000',
      author: 'Daniel da Silva'
    }
  })
  .source('./app')
  .destination('./build')
  .ignore(['layouts', 'includes'])
  .clean(true)

  .use(originalFileURI('originalURI'))
  .use(collections({
    posts: {
      pattern: 'posts/**/*.md',
      sortBy: 'originalURI',
      reverse: true
    }
  }))

  .use(markdown())
  .use(permalinks({
    linksets: [{
      match: { collection: 'posts' },
      pattern: 'blog/:title',
    }]
  }))

  .use(layouts({
    engine: 'ejs',
    directory: 'app/layouts'
  }))

  .use(debug())
  .build(function(err) {
    if (err) throw err;
  });

/**
 * Store the original file uri.
 */
function originalFileURI (uriKey) {
  return function (files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function (file) {
      files[file][uriKey] = file;
    });
  };
}
