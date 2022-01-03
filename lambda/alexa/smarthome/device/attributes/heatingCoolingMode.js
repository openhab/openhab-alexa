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

const { ItemType } = require('@openhab/constants');
const { Capability, Property } = require('@alexa/smarthome/constants');
const DeviceAttribute = require('./attribute');

/**
 * Defines heating/cooling mode attribute class
 * @extends DeviceAttribute
 */
class HeatingCoolingMode extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return [
      'HeatingCoolingMode',
      // OH 2.x homekit tag support
      'homekit:HeatingCoolingMode',
      'homekit:TargetHeatingCoolingMode',
      'homekit:CurrentHeatingCoolingMode'
    ];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @return {Array}
   */
  static getCapabilities(item) {
    const itemType = item.groupType || item.type;

    return [
      { name: Capability.THERMOSTAT_CONTROLLER, property: Property.THERMOSTAT_MODE },
      // Add power controller capability if switch item type
      ...(itemType === ItemType.SWITCH ? [{ name: Capability.POWER_CONTROLLER, property: Property.POWER_STATE }] : [])
    ];
  }
}

module.exports = HeatingCoolingMode;
