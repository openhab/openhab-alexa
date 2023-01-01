/**
 * Copyright (c) 2010-2023 Contributors to the openHAB project
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

import { ItemType } from '#openhab/constants.js';
import AlexaAssetCatalog from '#alexa/smarthome/catalog.js';
import AlexaDisplayCategory from '#alexa/smarthome/category.js';
import { Capability, Property } from '#alexa/smarthome/constants.js';
import { Parameter, ParameterType } from '#alexa/smarthome/metadata.js';
import { TargetSetpoint } from '#alexa/smarthome/properties/index.js';
import AlexaUnitOfMeasure from '#alexa/smarthome/unitOfMeasure.js';
import Temperature from './temperature.js';

/**
 * Defines target temperature attribute class
 * @extends Temperature
 */
export default class TargetTemperature extends Temperature {
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
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_TARGET_TEMPERATURE];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @param  {Object} settings
   * @param  {Array}  categories
   * @return {Array}
   */
  static getCapabilities(item, metadata, settings, categories) {
    const itemType = item.groupType || item.type;
    const scale = this.getTemperatureScale(item, metadata, settings);
    const setpointRange = metadata.getConfigParameter(Parameter.SETPOINT_RANGE, ParameterType.RANGE);

    switch (itemType) {
      case ItemType.NUMBER:
      case ItemType.NUMBER_TEMPERATURE:
        // Use thermostat controller capability if has thermostat display category
        return !categories.length || categories.includes(AlexaDisplayCategory.THERMOSTAT)
          ? [
              {
                name: Capability.THERMOSTAT_CONTROLLER,
                property: Property.TARGET_SETPOINT,
                parameters: {
                  scale: this.getV2TemperatureScale(metadata)
                }
              }
            ]
          : [
              {
                name: Capability.RANGE_CONTROLLER,
                instance: TargetTemperature.name,
                property: Property.RANGE_VALUE,
                parameters: {
                  capabilityNames: TargetTemperature.capabilityNames,
                  supportedRange:
                    scale === AlexaUnitOfMeasure.UNIT_FAHRENHEIT
                      ? [...(setpointRange || TargetSetpoint.DEFAULT_RANGE_FAHRENHEIT), 1]
                      : [...(setpointRange || TargetSetpoint.DEFAULT_RANGE_CELSIUS), 0.5],
                  unitOfMeasure:
                    scale === AlexaUnitOfMeasure.UNIT_FAHRENHEIT
                      ? AlexaUnitOfMeasure.TEMPERATURE_FAHRENHEIT
                      : AlexaUnitOfMeasure.TEMPERATURE_CELSIUS
                }
              }
            ];
    }
  }
}
