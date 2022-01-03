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
const AlexaProperty = require('./property');

/**
 * Defines equalizer bands property class
 * @extends AlexaProperty
 */
class EqualizerBands extends AlexaProperty {
  /**
   * Defines bass equalizer band
   * @type {String}
   */
  static BASS = 'bass';

  /**
   * Defines midrange equalizer band
   * @type {String}
   */
  static MIDRANGE = 'midrange';

  /**
   * Defines treble equalizer band
   * @type {String}
   */
  static TREBLE = 'treble';

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
      [Parameter.RANGE]: ParameterType.RANGE,
      [Parameter.DEFAULT_LEVEL]: ParameterType.INTEGER,
      [Parameter.INCREMENT]: ParameterType.INTEGER
    };
  }

  /**
   * Returns alias parameters for backward compatibility
   * @return {Object}
   */
  get aliasParameters() {
    return {
      default: Parameter.DEFAULT_LEVEL
    };
  }

  /**
   * Returns required sub-property components
   * @return {Array}
   */
  get requiredComponents() {
    return [EqualizerBands.BASS, EqualizerBands.MIDRANGE, EqualizerBands.TREBLE];
  }

  /**
   * Returns default range value based on item type
   * @return {Array}
   */
  get defaultRange() {
    return this.item.type === ItemType.DIMMER ? [0, 100] : [-10, 10];
  }

  /**
   * Returns range based on parameter
   * @return {Array}
   */
  get range() {
    return this.parameters[Parameter.RANGE] || this.defaultRange;
  }

  /**
   * Returns default band level based on parameter
   * @return {Number}
   */
  get defaultLevel() {
    return this.parameters[Parameter.DEFAULT_LEVEL] || Math.round((this.range[0] + this.range[1]) / 2);
  }

  /**
   * Returns increment based on parameter
   * @return {Number}
   */
  get increment() {
    return this.parameters[Parameter.INCREMENT];
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Number}
   */
  getState(value) {
    // Return state if numerical value
    if (!isNaN(value)) {
      return parseInt(value);
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

    const range = parameters[Parameter.RANGE] || [];
    // Update range parameter if valid (min < max), otherwise set to undefined
    parameters[Parameter.RANGE] = range[0] < range[1] ? range.map((value) => Math.round(value)) : undefined;

    const level = parameters[Parameter.DEFAULT_LEVEL];
    // Update default level parameter if valid, otherwise set to undefined
    parameters[Parameter.DEFAULT_LEVEL] = level >= this.range[0] && level <= this.range[1] ? level : undefined;
  }
}

module.exports = EqualizerBands;
