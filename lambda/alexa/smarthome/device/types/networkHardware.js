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

const AlexaDisplayCategory = require('@alexa/smarthome/category');
const { Capability } = require('@alexa/smarthome/constants');
const GenericDevice = require('./genericDevice');

/**
 * Defines network hardware device type class
 * @extends GenericDevice
 */
class NetworkHardware extends GenericDevice {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['NetworkHardware'];
  }

  /**
   * Returns group capabilities
   * @return {Array}
   */
  static get groupCapabilities() {
    return [{ name: Capability.NETWORKING_HOME_NETWORK_CONTROLLER }];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.NETWORK_HARDWARE];
  }
}

module.exports = NetworkHardware;
