/**
* Copyright (c) 2014-2019 by the respective copyright holders.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*/
var common = require('./common.js');
var ohv3 = require('../ohConnectorV3.js');
var rest = require('../rest.js');
var settings = require('./settings.js');
var assert = common.assert;
var utils = common.utils;

describe('ohConnectorV3 Tests', function () {

  var callback, capture, response;

  before(function () {
    // mock rest external calls
    rest.getItem = function(token, itemName) {
      return Promise.resolve(Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.getItemsRecursively = function(token) {
      return Promise.resolve(Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.postItemCommand = function(token, itemName, value) {
      capture.calls.push({"name": itemName, "value": value});
      return Promise.resolve({"statusCode": 200});
    };

    // mock aws lambda callback calls
    callback = function(error, result) {
      capture.result = capture.result ? [].concat(capture.result, result) : result;
    };
  });

  beforeEach(function () {
    // reset mock variables
    response = {};
    capture = {"calls": [], "result": null};
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

        it(test.description, function (done) {
          response = {"openhab": test.mocked};
          ohv3.handleRequest(directive, callback);
          //wait for async responses
          setTimeout(function() {
            assert.discoveredEndpoints(capture.result.event.payload.endpoints, test.expected);
            done();
          }, 1);
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
            ohv3.handleRequest(utils.generateDirectiveRequest(test.directive), callback);
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
