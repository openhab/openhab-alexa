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
const { Parameter, ParameterType } = require('@alexa/smarthome/metadata');
const AlexaUnitOfMeasure = require('@alexa/smarthome/unitOfMeasure');
const DeviceAttribute = require('./attribute');

/**
 * Defines fan speed attribute class
 * @extends DeviceAttribute
 */
class FanSpeed extends DeviceAttribute {
  /**
   * Defines off speed
   * @type {String}
   */
  static OFF = 'OFF';

  /**
   * Defines low speed
   * @type {String}
   */
  static LOW = 'LOW';

  /**
   * Defines medium speed
   * @type {String}
   */
  static MEDIUM = 'MEDIUM';

  /**
   * Defines high speed
   * @type {String}
   */
  static HIGH = 'HIGH';

  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['FanSpeed'];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_SPEED, AlexaAssetCatalog.SETTING_FAN_SPEED];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @return {Array}
   */
  static getCapabilities(item, metadata) {
    const itemType = item.groupType || item.type;
    const isInverted = metadata.getConfigParameter(Parameter.INVERTED, ParameterType.BOOLEAN) === true;
    const speedLevels = metadata.getConfigParameter(Parameter.SPEED_LEVELS, ParameterType.INTEGER) || 3;

    switch (itemType) {
      // Dimmer percentage control
      case ItemType.DIMMER:
        return [
          {
            name: Capability.RANGE_CONTROLLER,
            instance: FanSpeed.name,
            property: Property.RANGE_VALUE,
            parameters: {
              capabilityNames: FanSpeed.capabilityNames,
              supportedRange: [0, 100, 1],
              unitOfMeasure: AlexaUnitOfMeasure.PERCENT,
              presets: isInverted
                ? {
                    100: [AlexaAssetCatalog.VALUE_OFF],
                    66: [AlexaAssetCatalog.VALUE_LOW, AlexaAssetCatalog.VALUE_MINIMUM],
                    33: [AlexaAssetCatalog.VALUE_MEDIUM],
                    0: [AlexaAssetCatalog.VALUE_HIGH, AlexaAssetCatalog.VALUE_MAXIMUM]
                  }
                : {
                    0: [AlexaAssetCatalog.VALUE_OFF],
                    33: [AlexaAssetCatalog.VALUE_LOW, AlexaAssetCatalog.VALUE_MINIMUM],
                    66: [AlexaAssetCatalog.VALUE_MEDIUM],
                    100: [AlexaAssetCatalog.VALUE_HIGH, AlexaAssetCatalog.VALUE_MAXIMUM]
                  }
            }
          }
        ];
      // Number multi-speed control based on speed levels parameter if more than 1-speed, defaulting to 3-speed
      case ItemType.NUMBER:
        return speedLevels > 1
          ? [
              {
                name: Capability.RANGE_CONTROLLER,
                instance: FanSpeed.name,
                property: Property.RANGE_VALUE,
                parameters: {
                  capabilityNames: FanSpeed.capabilityNames,
                  supportedRange: [0, speedLevels, 1],
                  presets: [...Array(speedLevels + 1).keys()].reduce(
                    (presets, level) => ({
                      ...presets,
                      ...(level === 0
                        ? { 0: [AlexaAssetCatalog.VALUE_OFF] }
                        : level === 1
                        ? { 1: [AlexaAssetCatalog.VALUE_LOW, AlexaAssetCatalog.VALUE_MINIMUM] }
                        : level === Math.ceil(speedLevels / 2)
                        ? { [level]: [AlexaAssetCatalog.VALUE_MEDIUM] }
                        : level === speedLevels
                        ? { [level]: [AlexaAssetCatalog.VALUE_HIGH, AlexaAssetCatalog.VALUE_MAXIMUM] }
                        : {})
                    }),
                    {}
                  )
                }
              }
            ]
          : [];
      // String 3-speed control
      case ItemType.STRING:
        return [
          {
            name: Capability.MODE_CONTROLLER,
            instance: FanSpeed.name,
            property: Property.MODE,
            parameters: {
              capabilityNames: FanSpeed.capabilityNames,
              ordered: true,
              supportedModes: {
                [FanSpeed.OFF]: [AlexaAssetCatalog.VALUE_OFF],
                [FanSpeed.LOW]: [AlexaAssetCatalog.VALUE_LOW, AlexaAssetCatalog.VALUE_MINIMUM],
                [FanSpeed.MEDIUM]: [AlexaAssetCatalog.VALUE_MEDIUM],
                [FanSpeed.HIGH]: [AlexaAssetCatalog.VALUE_HIGH, AlexaAssetCatalog.VALUE_MAXIMUM]
              }
            }
          }
        ];
    }
  }
}

module.exports = FanSpeed;
