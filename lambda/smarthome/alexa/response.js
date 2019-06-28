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
    this.callback(null, response);
  }

  /**
   * Returns Alexa error response
   * @param  {Object} parameters  [namespace, payload]
   */
  returnAlexaErrorResponse(parameters = {}) {
    const response = this.generateResponse({
      header: {name: 'ErrorResponse', namespace: parameters.namespace},
      payload: parameters.payload
    });

    log.info('returnAlexaErrorResponse done with response:', response);
    this.returnAlexaResponse(response);
  }

  /**
   * Returns Alexa generic error response
   * @param  {Object} error   [error object] (optional)
   */
  returnAlexaGenericErrorResponse(error = {}) {
    // Set default error response parameters
    const parameters = {payload: {
      type: 'ENDPOINT_UNREACHABLE',
      message: error.cause || 'Unable to reach device'
    }};

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
      case 'RequestError':
        // Set to bridge unreachable if no error response, otherwise no such endpoint for items not found
        Object.assign(parameters, {payload: !error.response || !error.response.body ? {
          type: 'BRIDGE_UNREACHABLE',
          message: 'Server not accessible'
        } : {
          type: 'NO_SUCH_ENDPOINT',
          message: 'Item not found'
        }});
        break;
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
}

module.exports = AlexaResponse;
