multilevel-cache-tools
==================

A multilevel wrapper for [level-cache-tools](https://github.com/beaugunderson/node-level-cache-tools) so that you can get at your caches from multiple processes.

Installation
------------

    npm install multilevel-cache-tools

Usage
-----

First, start a server:

    var multilevelCacheTools = require('multilevel-cache-tools');
    multilevelCacheTools.server.create(
      {
        dbPath: 'cache.db',
        port: 3030
      },
      setUpClient
    );

Next, create a client for your cache that uses the same TCP port as your server:

    function setUpClient() {
      var memoizedFn = multilevelCacheTools.client.memoize({
        fn: asyncFn,
        port: 30303
      });

Then, you can use your cache.

      memoizedFn('reused value', console.log);
      // Logs result for function.
      memoizedFn('reused value', console.log);
      // Logs result for function, retrieved from DB in server.

See [level-cache-tools](https://github.com/beaugunderson/node-level-cache-tools) for more details about the caches.

**Note*: ValueCache is not implemented. Just MemoizedCache (see example above) and SimpleCache (`multilevelCacheTools.client.simple`).

Tests
-----

Run tests with `make test`.

License
-------

MIT.
