/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */

require('module-alias/register');
const log = require('@lib/log.js');
const rest = require('@lib/rest.js');
const ohv2 = require('@root/alexa/v2/ohConnector.js');
const settings = require('./settings.js');
const { assert, utils } = require('./common.js');

describe('ohConnectorV2 Tests', function () {

  let capture, context, response;

  before(function () {
    // mock rest external calls
    rest.getItem = function () {
      return Promise.resolve(
        Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.getItems = function () {
      return Promise.resolve(
        Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.postItemCommand = function (token, itemName, value) {
      capture.calls.push({'name': itemName, 'value': value});
      return Promise.resolve();
    };

    // mock log error calls
    log.error = function (...args) {
      capture.logs.push(
        args.map(arg => typeof arg === 'object' ? arg.stack || JSON.stringify(arg) : arg).join(' '));
    };

    // mock aws lambda context calls
    context = {
      'succeed': (result) => capture.result = result,
      'done': (error, result) => capture.result = result
    };
  });

  beforeEach(function () {
    // reset mock variables
    response = {};
    capture = {'calls': [], 'logs': [], 'result': null};
  });

  afterEach(function () {
    // output log errors if test failed
    if (this.currentTest.state === 'failed') {
      // eslint-disable-next-line no-console
      capture.logs.forEach(message => console.log(message));
    }
  });

  // Discovery Tests
  describe('Discovery Messages', function () {
    const directive = utils.generateDirectiveRequest({
      'header': {
        'name': 'DiscoverAppliancesRequest',
        'namespace': 'Alexa.ConnectedHome.Discovery',
        'payloadVersion': '2'
      }
    });

    Object.keys(settings.testCasesV2.discovery).forEach(function (name) {
      settings.testCasesV2.discovery[name].forEach(function (path) {
        const test = require(path);

        it(test.description, function (done) {
          response = {'openhab': test.mocked};
          ohv2.handleRequest(directive, context);
          // wait for async responses
          setTimeout(function () {
            // console.log('Appliances: ' + JSON.stringify(capture.result.payload.discoveredAppliances, null, 2));
            assert.discoveredAppliances(capture.result.payload.discoveredAppliances, test.expected);
            done();
          }, 1);
        });
      });
    });
  });

  // Controller Tests
  Object.keys(settings.testCasesV2.controllers).forEach(function (name){
    describe(name + ' Messages', function () {
      settings.testCasesV2.controllers[name].forEach(function (path){
        const tests = require(path);

        tests.forEach(function (test) {
          it(test.description, function (done) {
            response = test.mocked;
            ohv2.handleRequest(utils.generateDirectiveRequest(test.directive), context);
            // wait for async functions
            setTimeout(function () {
              // console.log('Capture: ' + JSON.stringify(capture, null, 2));
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
