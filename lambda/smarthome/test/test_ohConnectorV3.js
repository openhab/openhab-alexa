/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

require('module-alias/register');
const log = require('@lib/log.js');
const rest = require('@lib/rest.js');
const ohv3 = require('@root/ohConnectorV3.js');
const settings = require('./settings.js');
const { assert, utils } = require('./common.js');

describe('ohConnectorV3 Tests', function () {

  let callback, capture, response;

  before(function () {
    // mock rest external calls
    rest.getItem = function () {
      return Promise.resolve(
        Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.getItemsRecursively = function () {
      return Promise.resolve(
        Array.isArray(response.openhab) && response.staged ? response.openhab.shift() : response.openhab);
    };
    rest.getRegionalSettings = function () {
      return Promise.resolve(response.settings && response.settings.regional);
    };
    rest.postItemCommand = function (undefined, itemName, value) {
      capture.calls.push({'name': itemName, 'value': value});
      return Promise.resolve();
    };

    // mock log error calls
    log.error = function (...args) {
      capture.logs.push(
        args.map(arg => typeof arg === 'object' ? arg.stack || JSON.stringify(arg) : arg).join(' '));
    };

    // mock aws lambda callback calls
    callback = function (error, result) {
      capture.result = capture.result ? [].concat(capture.result, result) : result;
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
  describe('Discovery Interface', function () {
    const directive = utils.generateDirectiveRequest({
      'header': {
        'namespace': 'Alexa.Discovery',
        'name': 'Discover'
      }
    });

    Object.keys(settings.testCasesV3.discovery).forEach(function (name) {
      settings.testCasesV3.discovery[name].forEach(function (path) {
        const test = require(path);

        it(test.description, function (done) {
          response = {'openhab': test.mocked, 'settings': test.settings};
          ohv3.handleRequest(directive, callback);
          // wait for async responses
          setTimeout(function () {
            // console.log('Capture:', JSON.stringify(capture, null, 2));
            assert.discoveredEndpoints(capture.result.event.payload.endpoints, test.expected);
            assert.validSchema(capture.result, test.validate);
            done();
          }, 1);
        });
      });
    });
  });

  // Controller Tests
  Object.keys(settings.testCasesV3.controllers).forEach(function (name){
    describe(name + ' Interface', function () {
      settings.testCasesV3.controllers[name].forEach(function (path){
        const tests = require(path);

        tests.forEach(function (test) {
          it(test.description, function (done) {
            response = test.mocked;
            ohv3.handleRequest(utils.generateDirectiveRequest(test.directive), callback);
            // wait for async responses
            setTimeout(function () {
              // console.log('Capture:', JSON.stringify(capture, null, 2));
              assert.capturedCalls(capture.calls, test.expected.openhab);
              assert.capturedResult(capture.result, test.expected.alexa);
              assert.validSchema(capture.result, test.validate);
              done();
            }, 5);
          });
        });
      });
    });
  });
});
