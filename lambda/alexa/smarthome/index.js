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

const config = require('@root/config');
const log = require('@root/log');
const OpenHAB = require('@openhab');
const AlexaDirective = require('./directive');
const AlexaHandlers = require('./handlers');
const AlexaResponse = require('./response');
const { AlexaError, InvalidDirectiveError } = require('./errors');

/**
 * Defines alexa smart home skill request handler
 * @param  {Object}  request
 * @return {Promise}
 */
exports.handleRequest = async (request) => {
  // Initialize directive object
  const directive = new AlexaDirective(request.directive);
  // Initialize openhab object
  const openhab = new OpenHAB(config.openhab, directive.auth.token, AlexaResponse.TIMEOUT);

  let response;

  try {
    // Get directive handler function
    const handler = AlexaHandlers.get(directive.namespace, directive.name);

    // Throw invalid directive error if handler function not defined
    if (typeof handler !== 'function') {
      throw new InvalidDirectiveError(`Unsupported directive ${directive.namespace}/${directive.name}`);
    }

    // Load endpoint if present in directive
    if (directive.hasEndpoint) {
      directive.loadEndpoint();
    }

    // Get alexa response from handler function
    response = await handler(directive, openhab);

    // Add response context properties if directive has endpoint
    if (directive.hasEndpoint) {
      const properties = await directive.endpoint.getContextProperties(openhab);
      response.setContextProperties(properties);
    }
  } catch (error) {
    // Log error if not alexa error
    if (!(error instanceof AlexaError)) {
      logError(error, directive);
    }

    // Get alexa error response
    response = directive.error(error instanceof AlexaError ? error : AlexaError.fromGenericError(error));
  }

  // Log response object
  log.info('Response:', response.toJSON());
  // Return response object
  return response.toJSON();
};

/**
 * Logs error based on error type
 * @param  {Object} error
 * @param  {Object} directive
 */
function logError(error, directive) {
  let level, message;

  // Define log level channel and error message based on error type
  if (error.name === 'RequestError') {
    level = 'warn';
    message = 'Request' + error.message;
  } else if (error.name === 'StatusCodeError') {
    level = 'warn';
    message = 'StatusCodeError: ' + error.statusCode;
  } else {
    level = 'error';
    message = error.stack.split(/\n\s+/).slice(0, 2).join(' ');
  }

  // Log error object in debug channel
  log.debug('Error:', error);
  // Log error message in defined log level channel with directive object essential properties
  log[level](message, { directive: directive.toJSON() });
}
