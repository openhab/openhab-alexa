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
const { Parameter, ParameterType } = require('../metadata');
const { AlexaPresetResources } = require('../resources');
const AlexaUnitOfMeasure = require('../unitOfMeasure');
const Generic = require('./generic');

/**
 * Defines range value property class
 * @extends Generic
 */
class RangeValue extends Generic {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.DIMMER, ItemType.NUMBER, ItemType.ROLLERSHUTTER];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      ...super.supportedParameters,
      [Parameter.SUPPORTED_RANGE]: ParameterType.RANGE,
      [Parameter.PRESETS]: ParameterType.MAP,
      [Parameter.UNIT_OF_MEASURE]: ParameterType.STRING,
      [Parameter.INVERTED]: ParameterType.BOOLEAN
    };
  }

  /**
   * Returns if has supported item type
   * @return {Boolean}
   */
  get hasSupportedItemType() {
    return this.supportedItemTypes.includes(this.item.type.split(':')[0]);
  }

  /**
   * Returns default range value based on item type
   * @return {Array}
   */
  get defaultRange() {
    return this.item.type === ItemType.DIMMER || this.item.type === ItemType.ROLLERSHUTTER ? [0, 100, 1] : [0, 10, 1];
  }

  /**
   * Returns default unit of measure based on item type
   * @return {String}
   */
  get defaultUnitOfMeasure() {
    return this.item.type === ItemType.DIMMER || this.item.type === ItemType.ROLLERSHUTTER
      ? AlexaUnitOfMeasure.PERCENT
      : undefined;
  }

  /**
   * Returns supported range based on parameter
   * @return {Array}
   */
  get supportedRange() {
    return this.parameters[Parameter.SUPPORTED_RANGE] || this.defaultRange;
  }

  /**
   * Returns presets based on parameter
   * @return {Object}
   */
  get presets() {
    return this.parameters[Parameter.PRESETS];
  }

  /**
   * Returns unit of measure based on parameter
   * @return {String}
   */
  get unitOfMeasure() {
    return this.parameters[Parameter.UNIT_OF_MEASURE] || this.defaultUnitOfMeasure;
  }

  /**
   * Returns inverted based on parameter
   * @return {Boolean}
   */
  get inverted() {
    // Default inverted to true for rollershutter (UP=0; DOWN=100), otherwise to false
    return this.item.type === ItemType.ROLLERSHUTTER
      ? this.parameters[Parameter.INVERTED] !== false
      : this.parameters[Parameter.INVERTED] === true;
  }

  /**
   * Returns openhab command
   * @param  {String}  value
   * @param  {Boolean} isDelta
   * @return {Number}
   */
  getCommand(value, { isDelta = false } = {}) {
    const [minValue, maxValue] = this.supportedRange;

    // Convert value for dimmer/rollershutter percentage-based item types
    if (this.item.type === ItemType.DIMMER || this.item.type === ItemType.ROLLERSHUTTER) {
      value = (value / (maxValue - minValue)) * 100;
    }

    // Invert value if property inverted
    if (this.inverted) {
      value = (isDelta ? 0 : maxValue) - value;
    }

    return value;
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Number}
   */
  getState(value) {
    const [minValue, maxValue] = this.supportedRange;

    // Convert value for dimmer/rollershutter percentage-based item types
    if (this.item.type === ItemType.DIMMER || this.item.type === ItemType.ROLLERSHUTTER) {
      value = (value * (maxValue - minValue)) / 100;
    }

    // Invert value if property inverted
    if (this.inverted) {
      value = maxValue - value;
    }

    // Return formatted state if numerical value
    if (!isNaN(value)) {
      return parseFloat(value);
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

    // Define supported range as follow:
    //  1) using parameter values if defined
    //  2) using item state description minimum, maximum & step values if available
    //  3) empty array
    const range = parameters[Parameter.SUPPORTED_RANGE]
      ? parameters[Parameter.SUPPORTED_RANGE]
      : item.stateDescription
      ? [item.stateDescription.minimum, item.stateDescription.maximum, item.stateDescription.step]
      : [];
    // Update supported range values if valid (min < max; max - min > prec), otherwise set to undefined
    parameters[Parameter.SUPPORTED_RANGE] =
      range[0] < range[1] && range[1] - range[0] > Math.abs(range[2]) ? range : undefined;

    // Define presets as follow:
    //  1) using parameter values if defined
    //  2) using item state options if available
    //  3) empty object
    const presets = parameters[Parameter.PRESETS]
      ? parameters[Parameter.PRESETS]
      : item.stateDescription && item.stateDescription.options
      ? Object.fromEntries(item.stateDescription.options.map((option) => [option.value, option.label]))
      : {};
    // Update presets parameter, removing duplicate labels and entries
    //  with out of range values, not multiple of range precision, or with no valid labels
    parameters[Parameter.PRESETS] = Object.entries(presets)
      .map(([preset, labels = '']) => [
        preset,
        Array.isArray(labels) ? labels : labels.split(':').map((label) => label.trim())
      ])
      .map(([preset, labels], index, array) => [
        preset,
        labels.filter(
          (label) =>
            AlexaPresetResources.isValidLabel(label) &&
            array.findIndex(([, labels]) => labels.includes(label)) === index
        )
      ])
      .filter(
        ([preset, labels]) =>
          preset >= this.supportedRange[0] &&
          preset <= this.supportedRange[1] &&
          preset % this.supportedRange[2] === 0 &&
          labels.length > 0
      )
      .reduce((presets, [preset, labels]) => ({ ...presets, [preset]: labels }), undefined);

    // Define unit of measure as follow:
    //  1) using parameter value if defined
    //  2) using alexa unit of measure id based on
    //    item type dimension, item state presentation and server regional settings
    const uom = parameters[Parameter.UNIT_OF_MEASURE]
      ? parameters[Parameter.UNIT_OF_MEASURE]
      : AlexaUnitOfMeasure.getId({
          dimension: item.type.split(':')[1],
          statePresentation: item.stateDescription && item.stateDescription.pattern,
          system: settings.regional.measurementSystem || settings.regional.region
        });
    // Update unit of measure parameter if valid, otherwise set to undefined
    parameters[Parameter.UNIT_OF_MEASURE] = AlexaUnitOfMeasure.isSupported(uom) ? uom : undefined;
  }
}

module.exports = RangeValue;
