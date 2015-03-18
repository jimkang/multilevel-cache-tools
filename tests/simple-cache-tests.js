var async = require('async');
var should = require('chai').should();
var fs = require('fs-extra');

var tools = require('../index');
var createServer = tools.server.create;
var cacheClient = tools.client;

describe('SimpleCache', function () {
  var serverOpts = {
    dbPath: 'tests/simple-test.db',
    port: 3034
  };

  var cache;

  before(function setUpServer(done) {
    createServer(serverOpts, setUpSimpleCache);

    function setUpSimpleCache() {
      cache = cacheClient.simple({
        port: serverOpts.port
      });
      done();
    }
  });

  after(function cleanUp() {
    fs.remove(serverOpts.dbPath);
  });

  describe('put()', function () {
    it('should put a cache item', function (cb) {
      cache.put('abc', 'def', cb);
    });
  });

  describe('get()', function () {
    it('should get a put cache item', function (cb) {
      cache.get('abc', function (err, value) {
        if (err) {
          return cb(err);
        }

        value.should.equal('def');

        cb();
      });
    });
  });
});
