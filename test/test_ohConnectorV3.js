var ohv3 = require('../ohConnectorV3.js');
var rest = require('../rest.js');
var common = require('./common.js');
var settings = require('./settings.js');
var assert = common.assert;
var utils = common.utils;

describe('ohConnectorV3 Test', function () {

  var capture, context, input;

  before(function () {
    // set log level to error
    process.env.LOG_LEVEL = 'ERROR';

    // mock rest external calls
    rest.getItem = function(token, itemName, success, failure) {
      success(input.staged ? input.values.shift() : input.values);
    };
    rest.getItemsRecursively = function(token, success, failure) {
      success(input.staged ? input.values.shift() : input.values);
    };
    rest.getItemStates = function(token, success, failure) {
      success(input.staged ? input.values.shift() : input.values);
    };
    rest.postItemCommand = function(token, itemName, value, success) {
      capture.commands.push({"name": itemName, "value": value});
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
    input = {"staged": false, "values": null};
    capture = {"commands": [], "result" : null};
  });

  // Discovery Tests
  describe('Discovery Interface', function () {
    var directive = utils.generateDirectiveRequest({
      "header": {
        "namespace": "Alexa.Discovery",
        "name": "Discover"
      }
    });

    Object.keys(settings.testCases.discovery).forEach(function(name) {
      settings.testCases.discovery[name].forEach(function(path) {
        var test = require(path);

        it(test.description, function () {
          input = test.input;
          ohv3.handleRequest(directive, context);
          assert.discoverEndpoints(capture.result.event.payload.endpoints, test.expected);
        });
      });
    });
  });

  // Controller Tests
  Object.keys(settings.testCases.controllers).forEach(function(name){
    describe(name + ' Interface', function () {
      settings.testCases.controllers[name].forEach(function(path){
        var tests = require(path);

        tests.forEach(function(test) {
          it(test.description, function(done) {
            input = test.expected.openhab.input;
            ohv3.handleRequest(utils.generateDirectiveRequest(test.directive), context);
            // Wait for async functions
            setTimeout(function() {
              // console.log("Capture: " + JSON.stringify(capture, null, 2));
              assert.captureResult(capture.result, test.expected.alexa.response);
              assert.deepEqual(capture.commands, test.expected.openhab.commands);
              done();
            }, 5);
          });
        });
      });
    });
  });
});
