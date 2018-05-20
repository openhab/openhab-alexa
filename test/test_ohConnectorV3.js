/**
 * Copyright (c) 2014-2018 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */
var common = require('./common.js');
var ohv3 = require('../ohConnectorV3.js');
var rest = require('../rest.js');
var storage = require('../storage.js');
var settings = require('./settings.js');
var assert = common.assert;
var utils = common.utils;

describe('ohConnectorV3 Tests', function () {

  var callback, capture, response;

  before(function () {
    // mock rest external calls
    rest.getAuthTokens = function(request, success, failure) {
      if (request.code || request.refresh_token) {
        success({access_token: "access-token", token_type: "bearer", expires_in: 42, refresh_token: "refresh-token"});
      } else {
        failure({message: "Missing authorization parameters"});
      }
    };
    rest.getUserProfile = function(token, success, failure) {
      success({userId: "user-id", name: "name", email: "email"});
    };
    rest.getItem = function(token, itemName, success, failure) {
      success(Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.getItemsRecursively = function(token, success, failure) {
      success(Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.pollItemStateEvents = function(token, itemNames, timeout, success, failure) {
      success(itemNames.reduce((result, itemName, index) => Object.assign(result, {[itemName]: index}), {}));
    };
    rest.postItemCommand = function(token, itemName, value, success) {
      capture.calls.push({"name": itemName, "value": value});
      success({"statusCode": 200});
    };
    rest.postMessageEventGateway = function(token, message) {
      capture.result = capture.result ? [].concat(capture.result, message) : message;
    };

    // mock storage external calls
    storage.deleteUserSettings = function(userId, success, failure) {
      success();
    };
    storage.getUserSettings = function(userId, attributes, success, failure) {
      success({Item: {accessToken: "access-token", expireTime: 42, refreshToken: "refresh-token"}});
    };
    storage.saveUserSettings = function(userId, settings, success, failure) {
      success();
    };
    storage.updateUserSettings = function(userId, settings, success, failure) {
      success();
    };

    // mock aws lambda callback function
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

        it(test.description, function () {
          response = {"openhab": test.mocked};
          ohv3.handleRequest(directive, callback);
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
