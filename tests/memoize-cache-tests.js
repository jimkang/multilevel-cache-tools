var async = require('async');
var should = require('chai').should();
var fs = require('fs-extra');

var createServer = require('../cache-server').create;
var cacheClient = require('../cache-client');

var ABC = 'abc';
var DEF = 'def';

function asyncFn(key, cb) {
  setTimeout(function () {
    cb(null, key + DEF);
  }, 50);
}

describe('MemoizeCache', function memoizeSuite() {
  var serverOpts = {
    dbPath: 'tests/memoize-test.db',
    port: 3033
  };

  before(function setUpServer(done) {
    createServer(serverOpts, done);
  });

  after(function cleanUp() {
    fs.remove(serverOpts.dbPath);
  });

  it('should memoize an async function correctly', function (cb) {
    var memoizedFn = cacheClient.memoize({
      fn: asyncFn,
      port: serverOpts.port
    });

    asyncFn(ABC, function (ignoredErr, result) {
      result.should.equal(ABC + DEF);

      async.times(5, function (nKey, nextKey) {
        async.times(50, function (n, next) {
          memoizedFn(nKey + ABC, function (err, result) {
            if (err) {
              return cb(err);
            }

            should.equal(result, nKey + ABC + DEF);

            next();
          });
        }, function (err) {
          nextKey(err);
        });
      }, function (err) {
        cb(err);
      });
    });
  });
});
