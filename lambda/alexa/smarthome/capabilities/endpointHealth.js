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

import AlexaCapability from './capability.js';
import { Capability, Interface, Property } from '../constants.js';
import { Connectivity } from '../properties/index.js';

/**
 * Defines Alexa.EndpointHealth interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-endpointhealth.html
 * @extends AlexaCapability
 */
export default class EndpointHealth extends AlexaCapability {
  /**
   * Returns name
   * @return {String}
   */
  static get name() {
    return Capability.ENDPOINT_HEALTH;
  }

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
