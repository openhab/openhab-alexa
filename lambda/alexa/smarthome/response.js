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

const { v4: uuidv4 } = require('uuid');

/**
 * Defines alexa response class
 *  https://developer.amazon.com/docs/device-apis/alexa-response.html
 */
class AlexaResponse {
  /**
   * Defines response timeout in milliseconds
   * @type {Number}
   */
  static TIMEOUT = 8000;

  /**
   * Defines standard response header name
   * @type {String}
   */
  static STANDARD = 'Response';

  /**
   * Defines deferred response header name
   * @type {String}
   */
  static DEFERRED = 'DeferredResponse';

  /**
   * Defines error response header name
   * @type {String}
   */
  static ERROR = 'ErrorResponse';

  /**
   * Constructor
   * @param {String} name
   * @param {String} namespace
   * @param {Object} payload
   * @param {String} payloadVersion
   */
  constructor(name, namespace, payload, payloadVersion) {
    this._response = { event: { header: { namespace, name, payloadVersion, messageId: uuidv4() }, payload } };
  }

  /**
   * Sets context properties
   * @param {Array} properties
   */
  setContextProperties(properties) {
    this._response.context = { properties };
  }

  /**
   * Sets correlation token
   * @param {String} token
   */
  setCorrelationToken(token) {
    this._response.event.header.correlationToken = token;
  }

  /**
   * Sets endpoint
   * @param {String} endpointId
   */
  setEndpoint({ endpointId }) {
    this._response.event.endpoint = { endpointId };
  }

  /**
   * Returns serialized response object
   * @return {Object}
   */
  toJSON() {
    return this._response;
  }
}

module.exports = AlexaResponse;
