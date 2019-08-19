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
const ohv3 = require('./ohConnectorV3.js');

/**
 * Main entry point.
 * Incoming events from Alexa Skill APIs are processed via this method.
 * @param  {Object}   event
 * @param  {Object}   context
 * @param  {Function} callback
 */
exports.handler = function (event, context, callback) {
  log.info('Input:', event);
  const version = parseInt(event.directive ? event.directive.header.payloadVersion : event.header.payloadVersion);
  switch (version) {
    case 3:
      ohv3.handleRequest(event.directive, callback);
      break;
    default:
      log.error(`No supported payloadVersion: ${version}`);
      callback('No supported payloadVersion.');
      break;
  }
};
