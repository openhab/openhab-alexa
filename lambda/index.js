/**
 * Copyright (c) 2010-2022 Contributors to the openHAB project
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
 * Defines skill event handler
 * @param  {Object}  event
 * @return {Promise}
 */
exports.handler = async (event) => {
  log.info('Received event:', event);

  if (event.directive && event.directive.header.payloadVersion === '3') {
    return AlexaSmarthome.handleRequest(event);
  }

  log.warn('Unsupported event:', event);
};
