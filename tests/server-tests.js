var assert = require('assert');
var fs = require('fs-extra');
var multilevel = require('multilevel');
var net = require('net');
var jsonfile = require('jsonfile');
var level = require('level');
var createServer = require('../cache-server').create;

function runServerTest(opts) {
  var cacheDb;
  var connection;

  createServer(opts, connectToServer);

  function connectToServer(error) {
    assert.ok(!error, 'Creates a server without error.');
    cacheDb = multilevel.client();
    connection = net.connect(opts.port);
    connection.on('error', onConnectError);

    onConnect();
  }

  function onConnect() {
    rpcStream = cacheDb.createRpcStream();
    connection.pipe(rpcStream).pipe(connection);

    cacheDb.put('something', 'test', shutDown);
  }

  function onConnectError(error) {
    console.log('Connection error:', error);
    assert.ok(!error, 'Connects to multilevel cacheDb without error.');
  }

  function shutDown(error) {
    assert.ok(!error, 'Client operation completes without error.');

    rpcStream.close();
    connection.end();

    cacheDb.close(cleanUp);  
  }

  function cleanUp(error) {
    assert.ok(!error, 'Can close client database.');
    fs.remove(opts.dbPath);
    console.log('Tests done!');
    // TODO: Figure out why multilevel (or an unclosed stream?) makes the process 
    // hang around.
    process.exit();
  }
}

runServerTest({
  port: 3032,
  dbPath: 'tests/server-test.db'
});
