var async = require('async');
var should = require('chai').should();
var fs = require('fs-extra');

var createServer = require('../cache-server').create;
var cacheClient = require('../cache-client');

describe('ValueCache', function () {
  var serverOpts = {
    dbPath: 'tests/value-test.db',
    port: 3035,
    valueEncoding: 'binary' // Necessary for ValueCache to work.
  };

  var strings;
  var HELLO_WORLD = 'hello world';

  before(function setUpServer(done) {
    createServer(serverOpts, setUpValueCache);

    function setUpValueCache() {
      strings = cacheClient.value({
        port: serverOpts.port
      });
      done();
    }
  });

  after(function cleanUp() {
    fs.remove(serverOpts.dbPath);
  });

  describe('ValueCache', function () {
    it('should return false when an item has not been stored', function (cb) {
      strings.contains(HELLO_WORLD, function (contains) {
        contains.should.equal(false);

        cb();
      });
    });

    it('should return true when an item as been stored', function (cb) {
      strings.put(HELLO_WORLD, function (err) {
        if (err) {
          return cb(err);
        }

        strings.put(HELLO_WORLD, function (err) {
          if (err) {
            return cb(err);
          }

          strings.contains(HELLO_WORLD, function (contains) {
            contains.should.equal(true);

            cb();
          });
        });
      });
    });
  });
});
