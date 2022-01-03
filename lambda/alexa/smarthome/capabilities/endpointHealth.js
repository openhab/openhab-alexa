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

const AlexaCapability = require('./capability');
const { Interface, Property } = require('../constants');
const { Connectivity } = require('../properties');

/**
 * Defines Alexa.EndpointHealth interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-endpointhealth.html
 * @extends AlexaCapability
 */
class EndpointHealth extends AlexaCapability {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_ENDPOINT_HEALTH;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.CONNECTIVITY]: Connectivity
    };
  }
}

module.exports = EndpointHealth;
