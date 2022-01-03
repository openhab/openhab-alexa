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
const { Capability, Interface, Property } = require('../constants');
const { NetworkAccess } = require('../properties');

/**
 * Defines Alexa.Networking.AccessController interface capability class
 *  https://developer.amazon.com/docs/networking/alexa-networking-accesscontroller.html
 * @extends AlexaCapability
 */
class NetworkingAccessController extends AlexaCapability {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_NETWORKING_ACCESS_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.NETWORK_ACCESS]: NetworkAccess
    };
  }

  /**
   * Returns required linked capabilities
   * @return {Array}
   */
  get requiredLinkedCapabilities() {
    return [{ name: Capability.NETWORKING_CONNECTED_DEVICE, property: Property.CONNECTED_DEVICE }];
  }

  /**
   * Returns capability configuration
   * @return {Object}
   */
  getCapabilityConfiguration() {
    return { supportsScheduling: false };
  }
}

module.exports = NetworkingAccessController;
