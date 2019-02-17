/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

var log = require('./log.js');
var ohv3 = require('./ohConnectorV3.js');

/**
 * Main entry point.
 * Incoming events from Alexa Lighting APIs are processed via this method.
 */
exports.handler = function (event, context, callback) {
  log.debug('Input: ' + JSON.stringify(event));
  var version = parseInt(event.directive ? event.directive.header.payloadVersion : event.header.payloadVersion);
  switch (version) {
    case 3:
      ohv3.handleRequest(event.directive, callback);
      break;
    default:
      log.error('No supported payloadVersion: ' + event.header.payloadVersion);
      callback('No supported payloadVersion.');
      break;
  }
};
