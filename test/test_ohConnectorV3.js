var common = require('./common.js');
var ohv3 = require('../ohConnectorV3.js');
var rest = require('../rest.js');
var settings = require('./settings.js');
var assert = common.assert;
var utils = common.utils;

describe('ohConnectorV3 Tests', function () {

  var capture, context, response;

  before(function () {
    // mock rest external calls
    rest.getItem = function(token, itemName, success, failure) {
      success(Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.getItemsRecursively = function(token, success, failure) {
      success(Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.getItemStates = function(token, success, failure) {
      success(Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.postItemCommand = function(token, itemName, value, success) {
      capture.calls.push({"name": itemName, "value": value});
      success({"statusCode": 200});
    };

    // mock aws lamnda context calls
    context = {
      "succeed": function(result) { capture.result = result; },
      "done": function(error, result) { capture.result = result; }
    };
  });

  beforeEach(function () {
    // reset mock variables
    response = {};
    capture = {"calls": [], "result" : null};
  });

  // Discovery Tests
  describe('Discovery Interface', function () {
    var directive = utils.generateDirectiveRequest({
      "header": {
        "namespace": "Alexa.Discovery",
        "name": "Discover"
      }
    });

    Object.keys(settings.testCasesV3.discovery).forEach(function(name) {
      settings.testCasesV3.discovery[name].forEach(function(path) {
        var test = require(path);

        it(test.description, function () {
          response = {"openhab": test.mocked};
          ohv3.handleRequest(directive, context);
          // console.log("Endpoints: " + JSON.stringify(capture.result.event.payload.endpoints, null, 2));
          assert.discoveredEndpoints(capture.result.event.payload.endpoints, test.expected);
        });
      });
    });
  });

  // Controller Tests
  Object.keys(settings.testCasesV3.controllers).forEach(function(name){
    describe(name + ' Interface', function () {
      settings.testCasesV3.controllers[name].forEach(function(path){
        var tests = require(path);

        tests.forEach(function(test) {
          it(test.description, function(done) {
            response = test.mocked;
            ohv3.handleRequest(utils.generateDirectiveRequest(test.directive), context);
            // Wait for async functions
            setTimeout(function() {
              // console.log("Capture: " + JSON.stringify(capture, null, 2));
              assert.capturedCalls(capture.calls, test.expected.openhab);
              assert.capturedResult(capture.result, test.expected.alexa);
              done();
            }, 5);
          });
        });
      });
    });
  });
});
