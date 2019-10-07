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

/**
 * Amazon Smart Home Skill Response for API V3
 */
const uuid = require('uuid/v4');
const log = require('@lib/log.js');
const { RESPONSE_TIMEOUT } = require('./config');

/**
 * Defines Alexa response class
 */
class AlexaResponse {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    this.directive = directive;
    this.callback = callback;
    // Start Alexa response timeout timer
    this.timer = this.setAlexaResponseTimer();
  }

  /**
   * Generates Alexa response
   * @param  {Object} parameters  [context, header, payload]
   * @return {Object}
   */
  generateResponse(parameters = {}) {
    return Object.assign({
    }, parameters.context && {
      // Include context properties if provided
      context: parameters.context
    }, {
      // Include event properties
      event: Object.assign({
        // Add event header
        header: this.generateResponseHeader(parameters.header)
      }, this.directive.endpoint && {
        // Add event endpoint if provided in directive
        endpoint: {
          scope: this.directive.endpoint.scope,
          endpointId: this.directive.endpoint.endpointId
        }
      }, {
        // Add event payload
        payload: parameters.payload || {}
      })
    });
  }

  /**
   * Generates Alexa response header
   * @param  {Object} parameters  [name, namespace]
   * @return {Object}
   */
  generateResponseHeader(parameters = {}) {
    return Object.assign({
      namespace: parameters.namespace || 'Alexa',
      name: parameters.name || 'Response',
      payloadVersion: this.directive.header.payloadVersion,
      messageId: uuid(),
    }, this.directive.header.correlationToken && {
      // Include correlationToken property if provided in directive header
      correlationToken: this.directive.header.correlationToken
    });
  }

  /**
   * Returns Alexa response
   * @param  {Object} response
   */
  returnAlexaResponse(response) {
    // Send response once, otherwise discard subsequent calls
    if (!this.called) {
      log.info('Response:', response);
      // Stop response timeout timer
      clearTimeout(this.timer);
      // Use callback function to send response
      this.callback(null, response);
      this.called = true;
    }
  }

  /**
   * Returns Alexa error response
   * @param  {Object} parameters  [error, namespace, payload]
   */
  returnAlexaErrorResponse(parameters = {}) {
    // Log error if parameter defined
    if (parameters.error) {
      const error = parameters.error;
      // Define essential directive properties
      const directive = Object.assign({
        namespace: this.directive.header.namespace,
        name: this.directive.header.name
      }, this.directive.endpoint ? {
        endpointId: this.directive.endpoint.endpointId,
        payload: this.directive.payload,
        propertyMap: JSON.parse(this.directive.endpoint.cookie.propertyMap || '{}'),
        token: this.directive.endpoint.scope.token
      } : {
        token: this.directive.payload.scope.token
      });
      // Define log level channel as warn if not instance of Error or is Request/StatusCodeError, otherwise as error
      const level = error instanceof Error === false ||
        ['RequestError', 'StatusCodeError'].includes(error.name) ? 'warn' : 'error';
      // Define error message using cause property if not instance of Error,
      //  otherwise specific error property for request and status code errors, fallback to stack trace property
      const message = error instanceof Error === false ? error.cause :
        error.name === 'RequestError' ? 'Request' + error.message :
        error.name === 'StatusCodeError' ? 'StatusCodeError: ' + error.statusCode :
        error.stack.split(/\n\s+/).slice(0, 2).join(' ');

      // Log error object in debug channel
      log.debug('Error:', error);
      // Log error message with essential directive properties in defined log level channel
      log[level](message, {directive: directive});
    }

    // Generate response object
    const response = this.generateResponse({
      header: {name: 'ErrorResponse', namespace: parameters.namespace},
      payload: parameters.payload
    });

    this.returnAlexaResponse(response);
  }

  /**
   * Returns Alexa generic error response
   * @param  {Object} error   [error object] (optional)
   */
  returnAlexaGenericErrorResponse(error = {}) {
    // Set default error response parameters
    const parameters = {
      error: error,
      payload: {
        type: 'ENDPOINT_UNREACHABLE',
        message: error.cause || 'Unable to reach device'
      }
    };

    // Update error response parameters based on error name or status code when applicable
    switch (error.statusCode || error.name) {
      case 400:
        Object.assign(parameters, {payload: {
          type: 'INVALID_VALUE',
          message: 'Invalid item command value'
        }});
        break;
      case 401:
        Object.assign(parameters, {payload: {
          type: 'INVALID_AUTHORIZATION_CREDENTIAL',
          message: 'Failed to authenticate'
        }});
        break;
      case 404:
        Object.assign(parameters, {payload: {
          type: 'NO_SUCH_ENDPOINT',
          message: 'Endpoint not found'
        }});
        break;
      case 500:
      case 502:
      case 503:
      case 504:
      case 'RequestError':
        Object.assign(parameters, {payload: {
          type: 'BRIDGE_UNREACHABLE',
          message: 'Server not accessible'
        }});
        break;
      case 'SyntaxError':
      case 'TypeError':
        Object.assign(parameters, {payload: {
          type: 'INTERNAL_ERROR',
          message: 'Internal error'
        }});
        break;
    }

    // Return alexa error response
    this.returnAlexaErrorResponse(parameters);
  }

  /**
   * Sets Alexa response timeout timer
   * @return {Object}
   */
  setAlexaResponseTimer() {
    const timeoutHandler = () => {
      this.returnAlexaErrorResponse({
        error: {
          cause: 'Response timed out'
        },
        payload: {
          type: 'INTERNAL_ERROR',
          message: 'Response timed out'
        }
      });
    };
    return setTimeout(timeoutHandler, RESPONSE_TIMEOUT - 100);
  }
}

module.exports = AlexaResponse;
