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
 * Defines equalizer mode property class
 * @extends AlexaProperty
 */
class EqualizerMode extends AlexaProperty {
  /**
   * Defines movie mode
   * @type {String}
   */
  static MOVIE = 'MOVIE';

  /**
   * Defines music mode
   * @type {String}
   */
  static MUSIC = 'MUSIC';

  /**
   * Defines night mode
   * @type {String}
   */
  static NIGHT = 'NIGHT';

  /**
   * Defines sport mode
   * @type {String}
   */
  static SPORT = 'SPORT';

  /**
   * Defines tv mode
   * @type {String}
   */
  static TV = 'TV';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.NUMBER, ItemType.STRING];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.SUPPORTED_MODES]: ParameterType.LIST
    };
  }

  /**
   * Returns supported values
   *  https://developer.amazon.com/docs/device-apis/alexa-equalizercontroller.html#discovery
   * @return {Array}
   */
  get supportedValues() {
    return [EqualizerMode.MOVIE, EqualizerMode.MUSIC, EqualizerMode.NIGHT, EqualizerMode.SPORT, EqualizerMode.TV];
  }

  /**
   * Returns default value map based on item type
   * @return {Object}
   */
  get defaultValueMap() {
    switch (this.item.type) {
      case ItemType.NUMBER:
        return {
          [EqualizerMode.MOVIE]: 1,
          [EqualizerMode.MUSIC]: 2,
          [EqualizerMode.NIGHT]: 3,
          [EqualizerMode.SPORT]: 4,
          [EqualizerMode.TV]: 5
        };
      case ItemType.STRING:
        return {
          [EqualizerMode.MOVIE]: 'movie',
          [EqualizerMode.MUSIC]: 'music',
          [EqualizerMode.NIGHT]: 'night',
          [EqualizerMode.SPORT]: 'sport',
          [EqualizerMode.TV]: 'tv'
        };
      default:
        return {};
    }
  }

  /**
   * Returns default equalizer modes based on value map
   * @return {Array}
   */
  get defaultEqualizerModes() {
    return Object.keys(this.valueMap);
  }

  /**
   * Returns supported modes based on parameter
   * @return {Array}
   */
  get supportedModes() {
    return this.parameters[Parameter.SUPPORTED_MODES] || this.defaultEqualizerModes;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.supportedModes.length > 0;
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

    const modes = parameters[Parameter.SUPPORTED_MODES];
    // Update supported modes parameter removing alexa equalizer unsupported values if defined
    parameters[Parameter.SUPPORTED_MODES] = modes && modes.filter((value) => this.supportedValues.includes(value));
  }
}

module.exports = EqualizerMode;
