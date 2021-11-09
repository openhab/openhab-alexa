/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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
const Temperature = require('./temperature');

/**
 * Defines target temperature attribute class
 * @extends Temperature
 */
class TargetTemperature extends Temperature {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return [
      'TargetTemperature',
      'homekit:TargetTemperature' // OH 2.x homekit tag support
    ];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @return {Array}
   */
  static getCapabilities(item, metadata) {
    return [
      {
        name: Capability.THERMOSTAT_CONTROLLER,
        property: Property.TARGET_SETPOINT,
        parameters: {
          scale: this.getV2TemperatureScale(metadata)
        }
      }
    ];
  }
}

module.exports = TargetTemperature;
