const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTokens = require('./lib/replaceTokens');

// Get product data
const productsString = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productsArray = JSON.parse(productsString);

// Get templates
const overviewTemplate = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const cardTemplate = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

// Create server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    const cardsHtml = productsArray.map((product) => replaceTokens(cardTemplate, product)).join('\n');
    const overviewHtml = overviewTemplate.replace('{productCards}', cardsHtml);

    return res.writeHead(200, { 'Content-type': 'text/html' }).end(overviewHtml);
  }

  // Product page
  if (pathname === '/product') {
    const product = productsArray.find((product) => product.id === +query.id);
    const productHtml = replaceTokens(productTemplate, product);

    return res.writeHead(200, { 'Content-type': 'text/html' }).end(productHtml);
  }

  // API
  if (pathname === '/api') {
    return res.writeHead(200, { 'Content-type': 'application/json' }).end(productsString);
  }

  // Page not found
  return res.writeHead(404, { 'Content-type': 'text/html' }).end('<h1>Page not found!</h1>');
});

// Start listening for requests
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening for requests on http://127.0.0.1:8000');
});
