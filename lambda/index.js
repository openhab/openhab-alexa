/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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
const log = require('./log');
const AlexaSmarthome = require('./alexa/smarthome');

/**
 * Main entry point.
 * Incoming events from Alexa Skill APIs are processed via this method.
 * @param  {Object}   event
 * @param  {Object}   context
 * @param  {Function} callback
 */
exports.handler = (event, context, callback) => {
  log.info('Received event:', event);

  if (event.directive && event.directive.header.payloadVersion === '3') {
    AlexaSmarthome.handleRequest(event, callback);
  } else {
    log.error('Unsupported event:', event);
    callback('Unsupported event');
  }
};
