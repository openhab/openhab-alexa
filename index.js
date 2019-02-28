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
const ohv3 = require('./ohConnectorV3.js');

/**
 * Main entry point.
 * Incoming events from Alexa Skill APIs are processed via this method.
 * @param  {Object}   event
 * @param  {Object}   context
 * @param  {Function} callback
 */
exports.handler = function (event, context, callback) {
  log.debug('Input:', event);
  const version = parseInt(event.directive ? event.directive.header.payloadVersion : event.header.payloadVersion);
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
