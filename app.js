const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const port = process.env.PORT || 8080;

var tests = {};

const server = http.createServer((req, res) => {
  console.log('req.url: ', req.url);
  var myUrl = url.parse(req.url);
  var params = querystring.parse(myUrl.query);
  if (req.method === 'POST' && myUrl.pathname === '/startTest') {
  } else if (req.method === 'GET' && myUrl.pathname === '/testStatus') {
  } else if (req.method === 'GET' && myUrl.pathname === '/testResults') {
  } else if (req.method === 'GET' && myUrl.pathname === '/allTests') {
  } else {
    res.write('Invalid request');
    res.end();
  }
});

server.listen(port, () => {
  console.log('server currently listening on', server.address().port);
  setInterval(function() {
    tests = {};
    persistTests();
  }, 24 * 60 * 60 * 1000);
});

function persistTests() {
  fs.writeFile('alltests.txt', JSON.stringify(tests), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log('Persisted allTests.txt!');
  });
}

function processStartTest(req, res) {
  var id = guid();
  req.on('data', function(chunk) {
    var siteData = {};
    tests[id] = {
      status: 'started',
      data: siteData
    };
    var jsonData = JSON.parse(chunk);
    var iterations = jsonData.iterations;
    var numOutstandingRequests = iterations * jsonData.sitesToTest.length;
    for (var i = 0; i < jsonData.sitesToTest.length; i++) {
      var siteToTest = jsonData.sitesToTest[i];
      siteData[siteToTest] = {
        startTime: new Date().getTime(),
        durations: [],
        numRemainingRequests: iterations,
        iterations: iterations
      };





