const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  console.log('req.url: ', req.url);