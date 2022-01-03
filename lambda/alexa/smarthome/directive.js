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

const { Interface } = require('./constants');
const AlexaEndpoint = require('./endpoint');
const AlexaResponse = require('./response');

/**
 * Defines alexa directive class
 */
class AlexaDirective {
  /**
   * Constructor
   * @param {Object} directive
   */
  constructor(directive) {
    this._directive = directive;
  }

  /**
   * Returns namespace
   * @return {String}
   */
  get namespace() {
    return this._directive.header.namespace;
  }

  /**
   * Returns instance
   * @return {String}
   */
  get instance() {
    return this._directive.header.instance;
  }

  /**
   * Returns name
   * @return {String}
   */
  get name() {
    return this._directive.header.name;
  }

  /**
   * Returns payload version
   * @return {String}
   */
  get payloadVersion() {
    return this._directive.header.payloadVersion;
  }

  /**
   * Returns payload
   * @return {Object}
   */
  get payload() {
    return this._directive.payload;
  }

  /**
   * Returns auth information
   * @return {Object}
   */
  get auth() {
    return this._directive.endpoint ? this._directive.endpoint.scope : this.payload.scope || this.payload.grantee;
  }

  /**
   * Returns if has endpoint
   * @return {Boolean}
   */
  get hasEndpoint() {
    return !!this._directive.endpoint;
  }

  /**
   * Loads endpoint
   */
  loadEndpoint() {
    this.endpoint = AlexaEndpoint.fromDirective(this._directive.endpoint);
  }

  /**
   * Returns alexa formatted response
   * @param  {String} name
   * @param  {String} namespace
   * @param  {Object} payload
   * @return {Object}
   */
  response({ name = AlexaResponse.STANDARD, namespace = Interface.ALEXA, payload = {} } = {}) {
    const response = new AlexaResponse(name, namespace, payload, this.payloadVersion);

    // Set response correlation token if provided in directive headers
    if (this._directive.header.correlationToken) {
      response.setCorrelationToken(this._directive.header.correlationToken);
    }
    // Set response endpoint if provided in directive
    if (this._directive.endpoint) {
      response.setEndpoint(this._directive.endpoint);
    }

    return response;
  }

  /**
   * Returns alexa formatted error response
   * @param  {String} type
   * @param  {String} message
   * @param  {String} namespace
   * @param  {Object} payload
   * @return {Object}
   */
  error({ type, message, namespace, payload }) {
    return this.response({ name: AlexaResponse.ERROR, namespace, payload: { type, message, ...payload } });
  }

  /**
   * Returns serialized directive object essential properties
   * @return {Object}
   */
  toJSON() {
    return {
      namespace: this.namespace,
      ...(this.instance && { instance: this.instance }),
      name: this.name,
      ...(this.hasEndpoint && {
        endpointId: this._directive.endpoint.endpointId,
        cookie: Object.entries(this._directive.endpoint.cookie || {}).reduce(
          (cookie, [key, value]) => ({ ...cookie, [key]: JSON.parse(value) }),
          {}
        ),
        payload: this.payload
      }),
      token: this.auth.token
    };
  }
}

module.exports = AlexaDirective;
