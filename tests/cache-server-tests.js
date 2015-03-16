var assert = require('assert');
var createSimpleCacheServer = require('../cache-server').createSimpleCacheServer;
var fs = require('fs-extra');
var multilevel = require('multilevel');
var net = require('net');
var jsonfile = require('jsonfile');
var level = require('level');

var testPort = 3032;

var connection;
var db;
var rpcStream;

createSimpleCacheServer(
  {
    dbPath: 'tests/test.db',
    port: testPort
  },
  connectToServer
);

function connectToServer(error) {
  assert.ok(!error, 'Creates a server without error.');
  // var manifest = jsonfile.readFileSync(__dirname + '/manifest.json');
  db = multilevel.client(/*manifest*/);
  connection = net.connect(testPort/*, onConnect*/);
  connection.on('error', onConnectError);

  onConnect();
}

function onConnect() {
  rpcStream = db.createRpcStream();
  connection.pipe(rpcStream).pipe(connection);

  db.put('abc', 'def', checkPut);
}

function checkPut(error) {
  assert.ok(!error, 'Puts without an error.');
  db.get('abc', checkGet);
}

function checkGet(error, value) {
  assert.ok(!error, 'Gets without an error.');
  assert.equal(value, 'def', 'Gets the correct value.');
  console.log('Got value:', value);
  shutDown();
}

function onConnectError(error) {
  console.log('Connection error:', error);
  assert.ok(!error, 'Connects to multilevel db without error.');
}

function shutDown() {
  rpcStream.close();
  connection.end();

  db.close(cleanUp);  
}

function cleanUp(error) {
  assert.ok(!error, 'Can close client database.');
  fs.remove('tests/test.db');
  console.log('Tests done!');
  // TODO: Figure out why the multilevel makes the process hang around.
  process.exit();
}

