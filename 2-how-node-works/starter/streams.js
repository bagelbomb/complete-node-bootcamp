const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // Solution 1
  // fs.readFile('./test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });


  // Solution 2: Streams
  // const readableStream = fs.createReadStream('./test-file.txt');

  // readableStream.on('data', chunk => {
  //   res.write(chunk);
  // });

  // readableStream.on('end', () => {
  //   res.end();
  // });

  // readableStream.on('error', err => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('Error: file not found');
  // });


  // Solution 3: Pipes
  const readableStream = fs.createReadStream('./test-file.txt');
  readableStream.pipe(res);
  // readable source stream pipes to a writable destination stream

});

server.listen(8000, () => {
  console.log('Listening on http://localhost:8000');
});
