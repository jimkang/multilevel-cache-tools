var multilevel = require('multilevel');
var net = require('net');
var path = require('path');
var levelCacheTools = require('level-cache-tools');
var _ = require('lodash');

function createSimpleCacheServer(opts, done) {
	return createCacheServer(opts, levelCacheTools.SimpleCache, 'simple', done);
}

function createCacheServer(serverOpts, cacheClass, cacheName, done) {
	var dbPath;
	var port;
	var cacheClass;

	if (serverOpts) {
		dbPath = serverOpts.dbPath;
		port = serverOpts.port;
	}

	if (!dbPath) {
		throw new Error('No dbPath provided to createCacheServer.');
	}
	if (!port) {
		port = 3030;
	}
	var cache = new cacheClass(dbPath);
	exposeMethods(cache, cache.db);

  multilevel.writeManifest(
  	cache.db, path.dirname(dbPath) + '/' + cacheName + '-manifest.json'
  );

	var server = net.createServer(function connectMultilevelToDB(connection) {
		debugger;
	  connection.pipe(multilevel.server(cache.db)).pipe(connection);
	  connection.on('close', function onConnectionEnd() {
	  	debugger;
	  	cache.close();
	  });
	});
	server.listen(port, done);
}

function exposeMethods(cacheInstance, db) {
	db.methods = db.methods || {};

	var exposeMethod = _.curry(exposeMethodThroughDb)(cacheInstance, db);
	var methodNames = _.keys(cacheInstance).filter(isAFunction);
	methodNames.forEach(exposeMethod);
}

function isAFunction(obj) {
	return typeof obj === 'function';
}

function exposeMethodThroughDb(cacheInstance, db, methodName) {
	// Assumption: All level-cache-tool methods are async.
	db.methods[methodName] = {type: 'async'};
	db[methodName] = cacheInstance[methodName].bind(cacheInstance);
}

module.exports = {
	createSimpleCacheServer: createSimpleCacheServer
};

