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
const AlexaAssetCatalog = require('@alexa/smarthome/catalog');
const { Capability, Property } = require('@alexa/smarthome/constants');
const AlexaUnitOfMeasure = require('@alexa/smarthome/unitOfMeasure');
const DeviceAttribute = require('./attribute');

/**
 * Defines battery level attribute class
 * @extends DeviceAttribute
 */
class BatteryLevel extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['BatteryLevel'];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_BATTERY_LEVEL];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @return {Array}
   */
  static getCapabilities(item) {
    const itemType = item.groupType || item.type;

    switch (itemType) {
      case ItemType.DIMMER:
      case ItemType.NUMBER:
      case ItemType.NUMBER_DIMENSIONLESS:
        return [
          {
            name: Capability.RANGE_CONTROLLER,
            instance: BatteryLevel.name,
            property: Property.RANGE_VALUE,
            parameters: {
              capabilityNames: BatteryLevel.capabilityNames,
              nonControllable: true,
              supportedRange: [0, 100, 1],
              unitOfMeasure: AlexaUnitOfMeasure.PERCENT
            }
          }
        ];
    }
  }
}

module.exports = BatteryLevel;
