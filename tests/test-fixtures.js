var assert = require('assert');
var fs = require('fs-extra');
var multilevel = require('multilevel');
var net = require('net');
var jsonfile = require('jsonfile');
var level = require('level');

function runServerTest(opts) {
  var cacheDb;
  var connection;

  opts.createServerFn(
    {
      dbPath: 'tests/test.db',
      port: opts.port
    },
    connectToServer
  );

  function connectToServer(error) {
    assert.ok(!error, 'Creates a server without error.');
    var manifest = jsonfile.readFileSync(
      __dirname + '/' + opts.manifestFilename
    );
    cacheDb = multilevel.client(manifest);
    connection = net.connect(opts.port);
    connection.on('error', onConnectError);

    onConnect();
  }

  function onConnect() {
    rpcStream = cacheDb.createRpcStream();
    connection.pipe(rpcStream).pipe(connection);

    opts.cacheTests(cacheDb, shutDown);
  }

  function onConnectError(error) {
    console.log('Connection error:', error);
    assert.ok(!error, 'Connects to multilevel cacheDb without error.');
  }

  function shutDown() {
    rpcStream.close();
    connection.end();

    cacheDb.close(cleanUp);  
  }

  function cleanUp(error) {
    assert.ok(!error, 'Can close client database.');
    fs.remove('tests/test.db');
    console.log('Tests done!');
    // TODO: Figure out why multilevel (or an unclosed stream?) makes the process 
    // hang around.
    process.exit();
  }
}

module.exports = {
  runServerTest: runServerTest
};
