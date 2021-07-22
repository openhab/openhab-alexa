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
const { UNIT_CELSIUS, UNIT_FAHRENHEIT } = require('@alexa/smarthome/unitOfMeasure');
const DeviceAttribute = require('./attribute');

/**
 * Defines temperature attribute class
 * @extends DeviceAttribute
 */
class Temperature extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['CurrentTemperature'];
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
        name: Capability.TEMPERATURE_SENSOR,
        property: Property.TEMPERATURE,
        parameters: {
          scale: this.getV2TemperatureScale(metadata)
        }
      }
    ];
  }

  /**
   * Returns temperature scale based on V2 style tags
   * @param  {Object} metadata
   * @return {String}
   */
  static getV2TemperatureScale(metadata) {
    return metadata.values.find((value) => [UNIT_CELSIUS, UNIT_FAHRENHEIT].includes(value.toUpperCase()));
  }
}

module.exports = Temperature;
