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

const { Capability, Property } = require('@alexa/smarthome/constants');
const GenericDevice = require('./genericDevice');
const { NetworkAccess } = require('../attributes');

/**
 * Defines network device type class
 * @extends GenericDevice
 */
class NetworkDevice extends GenericDevice {
  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [NetworkAccess, ...super.supportedAttributes];
  }

  /**
   * Returns group capabilities
   * @return {Array}
   */
  static get groupCapabilities() {
    return [{ name: Capability.NETWORKING_CONNECTED_DEVICE, property: Property.CONNECTED_DEVICE }];
  }
}

module.exports = NetworkDevice;
