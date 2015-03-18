var levelCacheTools = require('level-cache-tools');
var multilevel = require('multilevel');
var net = require('net');

function createConnectedClientDb(opts) {
  var port;

  if (opts) {
    port = opts.port;
  }

  if (!port) {
    throw new Error('No port provided to createConnectedClientDb.')
  }

  var cacheDb = multilevel.client();
  var connection = net.connect(port);
  if (opts.onConnectError) {
    connection.on('error', opts.onConnectError);
  }

  var rpcStream = cacheDb.createRpcStream();
  connection.pipe(rpcStream).pipe(connection);

  return cacheDb;
}

function memoize(opts) {
  var fn;

  if (opts) {
    fn = opts.fn;
  }

  if (!fn) {
    throw new Error('No fn provided to client.');
  }

  var cacheDb = createConnectedClientDb(opts);
  return new levelCacheTools.MemoizeCache(cacheDb, opts.fn);
}

module.exports = {
  memoize: memoize
};
