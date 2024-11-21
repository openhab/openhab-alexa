/**
 * Copyright (c) 2010-2024 Contributors to the openHAB project
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

import log from './log.js';
import { handleRequest } from './alexa/smarthome/index.js';

/**
 * Defines skill event handler
 * @param  {Object}  event
 * @param  {Object}  context
 * @return {Promise}
 */
export const handler = async (event, context) => {
  log.info('Received event:', event);

  if (event.directive?.header.payloadVersion === '3') {
    return handleRequest(event, context);
  }

  log.warn('Unsupported event:', event);
};
