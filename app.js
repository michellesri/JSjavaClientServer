const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  console.log('req.url: ', req.url);
  var myUrl = url.parse(req.url);
  var params = querystring.parse(myUrl.query);
