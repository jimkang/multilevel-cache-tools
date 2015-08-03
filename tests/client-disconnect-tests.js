var test = require('tape');
var tools = require('../index');
var cacheClient = tools.client;
var spawn = require('child_process').spawn;

var ABC = 'abc';
var DEF = 'def';

function asyncFn(key, cb) {
  setTimeout(function () {
    cb(null, key + DEF);
  }, 50);
}

test('Disconnect responder', function disconnectTest(t) {
  t.plan(1);

  var cachePort = 8124;
  var cacheServer = spawn(
    'node', [__dirname + '/fixtures/start-mock-cache-server.js', cachePort]
  );
  cacheServer.stdout.pipe(process.stdout);

  setTimeout(connectToCache, 500);

  function connectToCache() {
    debugger;

    var memoizedFn = cacheClient.memoize({
      fn: asyncFn,
      port: cachePort,
      onDisconnect: checkError
    });

    // asyncFn(ABC, 
  }

  function checkError() {
    t.pass('The cache disconnect was reported.');
  }
});
