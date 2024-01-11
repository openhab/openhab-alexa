/**
 * Copyright (c) 2010-2024 Contributors to the openHAB project
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
import { ConnectedDevice } from '../properties/index.js';

/**
 * Defines Alexa.Networking.ConnectedDevice interface capability class
 *  https://developer.amazon.com/docs/networking/alexa-networking-connecteddevice.html
 * @extends AlexaCapability
 */
export default class NetworkingConnectedDevice extends AlexaCapability {
  /**
   * Returns name
   * @return {String}
   */
  static get name() {
    return Capability.NETWORKING_CONNECTED_DEVICE;
  }

  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_NETWORKING_CONNECTED_DEVICE;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.CONNECTED_DEVICE]: ConnectedDevice
    };
  }

  /**
   * Returns capability configuration
   * @return {Object}
   */
  getCapabilityConfiguration() {
    const configuration = {};
    const { deviceName, hostname, macAddress } = this.getProperty({ name: Property.CONNECTED_DEVICE });

    configuration.staticDeviceInformation = { deviceName, hostname, macAddress };

    return configuration;
  }

  /**
   * Returns relationship
   * @return {Object}
   */
  getRelationship() {
    const relationship = {};
    const { connectedTo: endpointId } = this.getProperty({ name: Property.CONNECTED_DEVICE });

    relationship.isConnectedBy = { endpointId };

    return relationship;
  }
}
