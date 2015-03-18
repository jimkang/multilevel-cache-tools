var multilevel = require('multilevel');
var net = require('net');
var path = require('path');
var _ = require('lodash');
var level = require('level');

function createServer(serverOpts, done) {
  var dbPath;
  var port;

  if (serverOpts) {
    dbPath = serverOpts.dbPath;
    port = serverOpts.port;
  }

  if (!dbPath) {
    throw new Error('No dbPath provided to createServer.');
  }
  if (!port) {
    port = 3030;
  }

  var db = level(dbPath);
  var server = net.createServer(connectMultilevelToDB);

  function connectMultilevelToDB(connection) {
    connection.pipe(multilevel.server(db)).pipe(connection);
  }

  server.listen(port, done);
}

module.exports = {
  create: createServer
};
