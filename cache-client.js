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
  if (opts.onDisconnect) {
    connection.on('close', opts.onDisconnect);
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

function simple(opts) {
  return new levelCacheTools.SimpleCache(createConnectedClientDb(opts));
}

function value(opts) {
  return new levelCacheTools.ValueCache(createConnectedClientDb(opts));
}

module.exports = {
  memoize: memoize,
  simple: simple,
  value: value
};
