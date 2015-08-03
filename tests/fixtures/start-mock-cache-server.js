var net = require('net');

var port = process.argv[2];
var server = net.createServer(configureConnection);
var connection;

server.listen(port, reportReady);

function configureConnection(c) {
  connection = c;
  console.log('client connected');
  c.on('end', respondToDisconnect);
  c.write('hello\r\n');
  c.pipe(c);

  setTimeout(makeCatastrophicError, 500);
}

function respondToDisconnect() {
  console.log('Client disconnected');
}

function reportReady() { //'listening' listener
  console.log('Mock cache server listening on port', port, '.');
}

function makeCatastrophicError() {
  debugger;
  // console.log(Object.keys(server));
  connection.close();
  console.log('Destroyed connection.');
  // throw new Error('Mock cache server error!');
}
