MOCHA = node_modules/.bin/mocha

test:
	node tests/server-tests.js
	$(MOCHA) tests/memoize-cache-tests.js
	$(MOCHA) tests/simple-cache-tests.js
