var levelCacheTools = require('level-cache-tools');
var multilevel = require('multilevel');
var net = require('net');

function memoize(opts) {
  var fn;
  var port;

  if (opts) {
    fn = opts.fn;
    port = opts.port;
  }

  if (!fn) {
    throw new Error('No fn provided to client.');
  }
  if (!port) {
    throw new Error('No port provided to client.')
  }

  var cacheDb = multilevel.client();
  var connection = net.connect(port);
  if (opts.onConnectError) {
    connection.on('error', opts.onConnectError);
  }

  var rpcStream = cacheDb.createRpcStream();
  connection.pipe(rpcStream).pipe(connection);

  return new levelCacheTools.MemoizeCache(cacheDb, opts.fn);
}

module.exports = {
  memoize: memoize
};
