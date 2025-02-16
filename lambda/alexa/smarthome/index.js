/**
 * Copyright (c) 2010-2025 Contributors to the openHAB project
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

import { AxiosError } from 'axios';
import Debug from '#root/debug.js';
import log from '#root/log.js';
import OpenHAB from '#openhab/index.js';
import AlexaDirective from './directive.js';
import AlexaResponse from './response.js';
import { AlexaError, InvalidDirectiveError } from './errors.js';

/**
 * Handles alexa smart home skill request
 * @param  {Object}  request
 * @param  {Object}  context
 * @return {Promise}
 */
export const handleRequest = async (request, context) => {
  // Initialize debug object
  const debug = new Debug();
  // Initialize directive object
  const directive = new AlexaDirective(request.directive);
  // Initialize openhab object
  const openhab = new OpenHAB(debug, context.awsRequestId, directive.auth.token, AlexaResponse.TIMEOUT);

  let response;

  // Start debug timeout timer
  debug.startTimer(directive, context);

  try {
    // Get directive handler function
    const handler = directive.getHandler();

    // Throw invalid directive error if handler function not defined
    if (typeof handler !== 'function') {
      throw new InvalidDirectiveError(`Unsupported directive ${directive.namespace}/${directive.name}`);
    }

    // Load endpoint if present in directive
    if (directive.hasEndpoint) {
      directive.loadEndpoint();
    }

    // Get alexa response from handler function
    await debug.captureAsyncFunc(handler.name, async () => {
      response = await handler(directive, openhab);
    });

    // Add response context properties if directive has endpoint
    if (directive.hasEndpoint) {
      await debug.captureAsyncFunc('addContextProperties', async () => {
        const properties = await directive.endpoint.getContextProperties(openhab);
        response.setContextProperties(properties);
      });
    }
  } catch (error) {
    // Log error if not alexa error
    if (!(error instanceof AlexaError)) {
      logError(error, directive);
    }

    // Get alexa error response
    response = directive.error(error instanceof AlexaError ? error : AlexaError.from(error));
  }

  // Cancel debug timeout timer
  debug.cancelTimer();

  // Log response object
  log.info('Response:', response.toJSON());
  // Return response object
  return response.toJSON();
};

/**
 * Logs error based on error type
 * @param {Object} error
 * @param {Object} directive
 */
const logError = (error, directive) => {
  let level, message;

  // Define log level channel and error message based on error type
  if (error instanceof AxiosError) {
    level = error.response?.status ? 'warn' : 'error';
    message = `RequestError: ${error.message}`;
  } else {
    level = 'error';
    message = error.stack.split(/\n\s+/).slice(0, 2).join(' ');
  }

  // Log error object in debug channel
  log.debug('Error:', error);
  // Log error message in defined log level channel with directive object essential properties
  log[level](message, { directive: directive.toJSON() });
};
