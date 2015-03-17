var assert = require('assert');
var createSimpleCacheServer = require('../cache-server').createSimpleCacheServer;
var fs = require('fs-extra');
var multilevel = require('multilevel');
var net = require('net');
var jsonfile = require('jsonfile');
var level = require('level');
var fixtures = require('./test-fixtures');

fixtures.runServerTest({
  createServerFn: createSimpleCacheServer,
  port: 3032,
  manifestFilename: 'simple-manifest.json',
  cacheTests: simpleCacheTests
});

function simpleCacheTests(cacheDb, done) {
  cacheDb.put('abc', 'def', checkPut);

  function checkPut(error) {
    assert.ok(!error, 'Puts without an error.');
    cacheDb.get('abc', checkGet);
  }

  function checkGet(error, value) {
    assert.ok(!error, 'Gets without an error.');
    assert.equal(value, 'def', 'Gets the correct value.');
    console.log('Got value:', value);
    done();
  }
}
