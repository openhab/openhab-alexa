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
import { Capability, Property, Parameter } from '#alexa/smarthome/constants.js';
import { AlexaUnitOfMeasure, AlexaUnitOfTemperature } from '#alexa/smarthome/unitOfMeasure.js';
import DeviceAttribute from './attribute.js';

/**
 * Defines temperature attribute class
 * @extends DeviceAttribute
 */
export default class Temperature extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['CurrentTemperature'];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_TEMPERATURE];
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

    switch (itemType) {
      case ItemType.NUMBER:
      case ItemType.NUMBER_TEMPERATURE:
        // Use temperature sensor capability if has temperature sensor or thermostat display category
        return !categories.length ||
          categories.includes(AlexaDisplayCategory.TEMPERATURE_SENSOR) ||
          categories.includes(AlexaDisplayCategory.THERMOSTAT)
          ? [
              {
                name: Capability.TEMPERATURE_SENSOR,
                property: Property.TEMPERATURE,
                parameters: {
                  scale: this.getV2TemperatureScale(metadata)
                }
              }
            ]
          : [
              {
                name: Capability.RANGE_CONTROLLER,
                instance: Temperature.name,
                property: Property.RANGE_VALUE,
                parameters: {
                  capabilityNames: Temperature.capabilityNames,
                  nonControllable: true,
                  supportedRange: scale === AlexaUnitOfTemperature.FAHRENHEIT ? [-58, 212, 1] : [-50, 100, 0.5],
                  unitOfMeasure:
                    scale === AlexaUnitOfTemperature.FAHRENHEIT
                      ? AlexaUnitOfMeasure.TEMPERATURE_FAHRENHEIT
                      : AlexaUnitOfMeasure.TEMPERATURE_CELSIUS
                }
              }
            ];
    }
  }

  /**
   * Returns temperature scale
   * @param  {Object} item
   * @param  {Object} metadata
   * @param  {Object} settings
   * @return {String}
   */
  static getTemperatureScale(item, metadata, settings) {
    // Return uppercased scale metadata parameter if defined
    if (metadata.getConfigParameter(Parameter.SCALE)) {
      return metadata.getConfigParameter(Parameter.SCALE).toUpperCase();
    }
    // Return scale based on item and regional server settings otherwise
    return AlexaUnitOfTemperature.valueOf({
      unitSymbol: item.unitSymbol,
      statePresentation: item.stateDescription?.pattern,
      system: settings.regional?.measurementSystem || settings.regional?.region
    });
  }

  /**
   * Returns temperature scale based on V2 style tags
   * @param  {Object} metadata
   * @return {String}
   */
  static getV2TemperatureScale(metadata) {
    return metadata.values
      .map((value) => value.toUpperCase())
      .find((value) => value === AlexaUnitOfTemperature.CELSIUS || value === AlexaUnitOfTemperature.FAHRENHEIT);
  }
}
