/**
* Copyright (c) 2014-2019 by the respective copyright holders.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*/
var common = require('./common.js');
var ohv2 = require('../ohConnectorV2.js');
var rest = require('../rest.js');
var settings = require('./settings.js');
var assert = common.assert;
var utils = common.utils;

describe('ohConnectorV2 Tests', function () {

  var capture, context, response;

  before(function () {
    // mock rest external calls
    rest.getItem = function(token, itemName, success, failure) {
      success(Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.getItems = function(token, success, failure) {
      success(Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.postItemCommand = function(token, itemName, value, success) {
      capture.calls.push({"name": itemName, "value": value});
      success({"statusCode": 200});
    };

    // mock aws lambda context calls
    context = {
      "succeed": function(result) { capture.result = result; },
      "done": function(error, result) { capture.result = result; }
    };
  });

  beforeEach(function () {
    // reset mock variables
    response = {};
    capture = {"calls": [], "result": null};
  });

  // Discovery Tests
  describe('Discovery Messages', function () {
    var directive = utils.generateDirectiveRequest({
      "header": {
        "name": "DiscoverAppliancesRequest",
        "namespace": "Alexa.ConnectedHome.Discovery",
        "payloadVersion": "2"
      }
    });

    Object.keys(settings.testCasesV2.discovery).forEach(function(name) {
      settings.testCasesV2.discovery[name].forEach(function(path) {
        var test = require(path);

        it(test.description, function () {
          response = {"openhab": test.mocked};
          ohv2.handleRequest(directive, context);
          // console.log("Appliances: " + JSON.stringify(capture.result.payload.discoveredAppliances, null, 2));
          assert.discoveredAppliances(capture.result.payload.discoveredAppliances, test.expected);
        });
      });
    });
  });

  // Controller Tests
  Object.keys(settings.testCasesV2.controllers).forEach(function(name){
    describe(name + ' Messages', function () {
      settings.testCasesV2.controllers[name].forEach(function(path){
        var tests = require(path);

        tests.forEach(function(test) {
          it(test.description, function(done) {
            response = test.mocked;
            ohv2.handleRequest(utils.generateDirectiveRequest(test.directive), context);
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
