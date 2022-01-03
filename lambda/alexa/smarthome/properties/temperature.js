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

const { Dimension, ItemType } = require('@openhab/constants');
const { Parameter, ParameterType } = require('../metadata');
const AlexaUnitOfMeasure = require('../unitOfMeasure');
const AlexaProperty = require('./property');

/**
 * Defines temperature property class
 * @extends AlexaProperty
 */
class Temperature extends AlexaProperty {
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
    //  2) using alexa unit name based on item state presentation and server regional settings
    const scale = parameters[Parameter.SCALE]
      ? parameters[Parameter.SCALE].toUpperCase()
      : AlexaUnitOfMeasure.getUnit({
          dimension: Dimension.TEMPERATURE,
          statePresentation: item.stateDescription && item.stateDescription.pattern,
          system: settings.regional.measurementSystem || settings.regional.region
        });
    // Update scale parameter
    parameters[Parameter.SCALE] =
      scale === AlexaUnitOfMeasure.UNIT_FAHRENHEIT
        ? AlexaUnitOfMeasure.UNIT_FAHRENHEIT
        : AlexaUnitOfMeasure.UNIT_CELSIUS;
  }
}

module.exports = Temperature;
