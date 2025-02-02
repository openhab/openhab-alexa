/**
 * Copyright (c) 2010-2025 Contributors to the openHAB project
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
import { Parameter, ParameterType } from '../constants.js';
import { AlexaUnitOfTemperature } from '../unitOfMeasure.js';
import AlexaProperty from './property.js';

/**
 * Defines temperature property class
 * @extends AlexaProperty
 */
export default class Temperature extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.NUMBER, ItemType.NUMBER_TEMPERATURE];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.SCALE]: ParameterType.STRING
    };
  }

  /**
   * Returns scale value based on parameter
   * @return {String}
   */
  get scale() {
    return this.parameters[Parameter.SCALE];
  }

  /**
   * Returns openhab command
   * @param  {String}  temperature
   * @param  {Boolean} isDelta
   * @return {Number}
   */
  getCommand(temperature, { isDelta = false } = {}) {
    const scale = this.scale;
    const conversion = temperature.scale.charAt(0) + '->' + scale.charAt(0);
    const value = parseFloat(temperature.value);

    switch (conversion.toUpperCase()) {
      case 'C->F':
        return (value * 9) / 5 + (isDelta ? 0 : 32);
      case 'F->C':
        return ((value - (isDelta ? 0 : 32)) * 5) / 9;
      default:
        return value;
    }
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Object}
   */
  getState(value) {
    const scale = this.scale;

    // Return formatted state if defined
    if (typeof value !== 'undefined' && typeof scale !== 'undefined') {
      return { value: parseFloat(value), scale: scale.toUpperCase() };
    }
  }

  /**
   * Updates parameters
   * @param {Object} item
   * @param {Object} metadata
   * @param {Object} settings
   */
  updateParameters(item, metadata, settings) {
    const parameters = this.parameters;
    // Update parameters from parent method
    super.updateParameters(item, metadata, settings);

    // Define scale as follow:
    //  1) using parameter uppercased value if defined
    //  2) using alexa unit name based on item and regional server settings
    const scale = parameters[Parameter.SCALE]
      ? parameters[Parameter.SCALE].toUpperCase()
      : AlexaUnitOfTemperature.valueOf({
          unitSymbol: item.unitSymbol,
          statePresentation: item.stateDescription?.pattern,
          system: settings.regional?.measurementSystem || settings.regional?.region
        });
    // Update scale parameter
    parameters[Parameter.SCALE] =
      scale === AlexaUnitOfTemperature.FAHRENHEIT ? AlexaUnitOfTemperature.FAHRENHEIT : AlexaUnitOfTemperature.CELSIUS;
  }
}
