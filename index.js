/**
 * Copyright (c) 2014-2016 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

var log = require('./log.js');
var utils = require('./utils.js');
var ohv2 = require('./ohConnectorV2.js');
var ohv3 = require('./ohConnectorV3.js');

/**
 * Main entry point.
 * Incoming events from Alexa Lighting APIs are processed via this method.
 */
exports.handler = function (event, context) {
  log.debug('Input: ' + JSON.stringify(event));
  var version = parseInt(event.directive ? event.directive.header.payloadVersion : event.header.payloadVersion);
  switch (version) {
    case 3:
      ohv3.handleRequest(event.directive, context);
      break;
    case 2:
      ohv2.handleRequest(event, context);
      break;
    default:
      log.error('No supported payloadVersion: ' + event.header.payloadVersion);
      context.done(null, utils.generateControlError(event.header.messageId, event.header.name, 'DependentServiceUnavailableError', 'Something went wrong...'));
      break;
  }
};
