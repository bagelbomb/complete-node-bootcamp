const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter {}

const emitter = new Sales();

emitter.on('newSale', () => {
  console.log('There was a new sale!');
});

emitter.on('newSale', () => {
  console.log('Customer Name: Tanner');
});

emitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in stock.`);
});

emitter.emit('newSale', 7);

///////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
  console.log(`Request received for ${req.url}`);
  res.end('Request received');
});

server.on('request', (req, res) => {
  console.log('Another request');
});

server.on('close', () => {
  console.log('Server closed');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests...');
});