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

const { clamp } = require('@root/utils');
const { Binding, ItemType } = require('@openhab/constants');
const { Parameter, ParameterType } = require('../metadata');
const AlexaProperty = require('./property');

/**
 * Defines color temperature property class
 * @extends AlexaProperty
 */
class ColorTemperature extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.DIMMER, ItemType.NUMBER];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.BINDING]: ParameterType.STRING,
      [Parameter.INCREMENT]: ParameterType.INTEGER,
      [Parameter.RANGE]: ParameterType.RANGE,
      [Parameter.REQUIRES_SET_COLOR_RESET]: ParameterType.BOOLEAN
    };
  }

  /**
   * Returns default range based on binding and thing type properties to differentiate white & color ranges
   * @return {Array}
   */
  get defaultRange() {
    switch (this.binding) {
      case Binding.HUE:
        return ['white', '0220'].includes(this.thingType) ? [2200, 6500] : [2000, 6500];
      case Binding.LIFX:
        return ['white', 'whitelight'].includes(this.thingType) ? [2700, 6500] : [2500, 9000];
      case Binding.MILIGHT:
        return ['white', 'whiteLed'].includes(this.thingType) ? [2700, 6500] : [2700, 6500];
      case Binding.TPLINK:
        return ['white', 'kl120', 'lb130'].includes(this.thingType) ? [2700, 6500] : [2500, 9000];
      case Binding.TRADFRI:
        return ['white', '0220'].includes(this.thingType) ? [2200, 4000] : [1780, 6000];
      case Binding.YEELIGHT:
        return ['white', 'ceiling', 'dolphin'].includes(this.thingType) ? [2700, 6500] : [1700, 6500];
      default:
        return [1000, 10000]; // alexa smapi defined valid range
    }
  }

  /**
   * Returns if has staturation color mode based on binding parameter
   * @return {Boolean}
   */
  get hasSaturationColorMode() {
    return this.binding !== Binding.HUE;
  }

  /**
   * Returns binding based on parameter
   * @return {Array}
   */
  get binding() {
    return this.parameters[Parameter.BINDING] && this.parameters[Parameter.BINDING].split(':')[0];
  }

  /**
   * Returns thing type based on parameter
   * @return {Array}
   */
  get thingType() {
    return this.parameters[Parameter.BINDING] && this.parameters[Parameter.BINDING].split(':')[1];
  }

  /**
   * Returns increment based on parameter
   * @return {Number}
   */
  get increment() {
    return this.parameters[Parameter.INCREMENT];
  }

  /**
   * Returns range based on parameter
   * @return {Array}
   */
  get range() {
    return this.parameters[Parameter.RANGE] || this.defaultRange;
  }

  /**
   * Returns if requires set color reset based on item type and parameter
   * @return {Boolean}
   */
  get requiresSetColorReset() {
    return this.item.type === ItemType.NUMBER && this.parameters[Parameter.REQUIRES_SET_COLOR_RESET] === true;
  }

  /**
   * Returns openhab command
   * @param  {String} value
   * @return {Number}
   */
  getCommand(value) {
    const [minValue, maxValue] = this.range;

    // Return converted value based on item type:
    //  - Dimmer: colder (0%) to warmer (100%) [bindings integration]
    //  - Number: color temperature value in K [custom integration]
    return this.item.type === ItemType.DIMMER
      ? ((maxValue - clamp(value, minValue, maxValue)) / (maxValue - minValue)) * 100
      : clamp(value, minValue, maxValue);
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Number}
   */
  getState(value) {
    const [minValue, maxValue] = this.range;

    // Convert value based on item type:
    //  - Dimmer: colder (0%) to warmer (100%) [bindings integration]
    //  - Number: color temperature value in K [custom integration]
    value =
      this.item.type === ItemType.DIMMER
        ? maxValue - (value * (maxValue - minValue)) / 100
        : clamp(value, minValue, maxValue);

    // Return state if numerical value
    if (!isNaN(value)) {
      return parseInt(value);
    }
  }

  /**
   * Returns if is in color mode
   * @param  {String}  color
   * @param  {String}  temperature
   * @return {Boolean}
   */
  isInColorMode(color, temperature) {
    // Return false if color state not defined
    if (typeof color === 'undefined') return false;

    // Return true if temperature state not defined
    if (typeof temperature === 'undefined') return true;

    return this.item.type === ItemType.DIMMER
      ? // based on color saturation depending on binding for dimmer
        color.split(',')[1] > 0 && this.hasSaturationColorMode
      : // based on temperature state for number
        parseInt(temperature) === 0;
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

    const binding = parameters[Parameter.BINDING];
    // Update binding parameter using item channel metadata value if not defined
    parameters[Parameter.BINDING] =
      binding || (item.metadata && item.metadata.channel && item.metadata.channel.value.split(':', 2).join(':'));

    const range = parameters[Parameter.RANGE] || [];
    // Update range parameter if valid (min < max), otherwise set to undefined
    parameters[Parameter.RANGE] = range[0] < range[1] ? range.map((value) => Math.round(value)) : undefined;
  }
}

module.exports = ColorTemperature;
