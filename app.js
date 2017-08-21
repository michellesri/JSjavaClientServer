const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  console.log('req.url: ', req.url);
  var myUrl = url.parse(req.url);
  var params = querystring.parse(myUrl.query);
