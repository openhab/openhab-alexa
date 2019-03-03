/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
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
    return Object.assign({},
      // Include context properties if provided
      parameters.context && {
        context: parameters.context
      },
      // Include event properties
      {
        event: Object.assign(
          // Add event header
          {
            header: this.generateResponseHeader(parameters.header)
          },
          // Add event endpoint if provided in directive
          this.directive.endpoint && {
            endpoint: {
              scope: this.directive.endpoint.scope,
              endpointId: this.directive.endpoint.endpointId
            }
          },
          // Add event payload
          {
            payload: parameters.payload || {}
          }
        )
      }
    );
  }

  /**
   * Generates Alexa response header
   * @param  {Object} parameters  [name, namespace]
   * @return {Object}
   */
  generateResponseHeader(parameters = {}) {
    return Object.assign(
      {
        namespace: parameters.namespace || 'Alexa',
        name: parameters.name || 'Response',
        messageId: uuid(),
        payloadVersion: this.directive.header.payloadVersion
      },
      // Include correlationToken property if provided in directive header
      this.directive.header.correlationToken && {
        correlationToken: this.directive.header.correlationToken
      }
    );
  }

  /**
   * Returns Alexa response
   * @param  {Object} response
   */
  returnAlexaResponse(response) {
    this.callback(null, response);
  };

  /**
   * Returns Alexa error response
   * @param  {Object} parameters  [namespace, payload]
   */
  returnAlexaErrorResponse(parameters = {}) {
    const response = this.generateResponse({
      header: {name: 'ErrorResponse', namespace: parameters.namespace},
      payload: parameters.payload
    });

    log.debug('returnAlexaErrorResponse done with response:', response);
    this.returnAlexaResponse(response);
  }

  /**
   * Returns Alexa generic error response
   */
  returnAlexaGenericErrorResponse() {
    this.returnAlexaErrorResponse({
      payload: {
        type: 'ENDPOINT_UNREACHABLE',
        message: 'Unable to reach device'
      }
    });
  }
}

module.exports = AlexaResponse;
