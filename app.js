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
    processStartTest(req, res);
  } else if (req.method === 'GET' && myUrl.pathname === '/testStatus') {
    processTestStatus(req, res, params['testHandle']);
  } else if (req.method === 'GET' && myUrl.pathname === '/testResults') {
    processTestResults(req, res, params['testHandle']);
  } else if (req.method === 'GET' && myUrl.pathname === '/allTests') {
    processAllTests(req, res);
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
      for (var it = 0; it < iterations; it++) {
        (function(url) {
          //take note of start time
          var startTime = new Date().getTime();
          try {
            http.get(url, function() {
              //time it took for http get to get a response
              siteData[url].durations.push(new Date().getTime() - startTime);

              numOutstandingRequests--;
              if (numOutstandingRequests === 0) {
                tests[id].status = 'finished';
                persistTests();
              }

              siteData[url].numRemainingRequests--;
              if (siteData[url].numRemainingRequests === 0) {
                siteData[url].endTime = new Date().getTime();
              }
            }).on('error', function() {
              console.log('GET request error for: ', url);
            });
          } catch (e) {
            console.log('Error happened when processing ' + url +
              ' with message: ' + e.message);
          }
        })(siteToTest);
      }
    }

    var result = {
      testHandle: id,
      status: tests[id].status
    };
    res.write(JSON.stringify(result));
    res.end();
  });
}
