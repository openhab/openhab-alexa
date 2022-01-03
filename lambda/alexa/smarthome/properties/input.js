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
 * Defines input property class
 * @extends AlexaProperty
 */
class Input extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.STRING];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.SUPPORTED_INPUTS]: ParameterType.LIST
    };
  }

  /**
   * Returns supported values
   *  https://developer.amazon.com/docs/device-apis/alexa-inputcontroller.html#input-values
   * @return {Array}
   */
  get supportedValues() {
    // prettier-ignore
    return [
      'AUX 1', 'AUX 2', 'AUX 3', 'AUX 4', 'AUX 5', 'AUX 6', 'AUX 7', 'BLURAY', 'CABLE', 'CD',
      'COAX 1', 'COAX 2', 'COMPOSITE 1', 'DVD', 'GAME', 'HD RADIO', 'HDMI 1', 'HDMI 2', 'HDMI 3',
      'HDMI 4', 'HDMI 5', 'HDMI 6', 'HDMI 7', 'HDMI 8', 'HDMI 9', 'HDMI 10', 'HDMI ARC', 'INPUT 1',
      'INPUT 2', 'INPUT 3', 'INPUT 4', 'INPUT 5', 'INPUT 6', 'INPUT 7', 'INPUT 8', 'INPUT 9',
      'INPUT 10', 'IPOD', 'LINE 1', 'LINE 2', 'LINE 3', 'LINE 4', 'LINE 5', 'LINE 6', 'LINE 7',
      'MEDIA PLAYER', 'OPTICAL 1', 'OPTICAL 2', 'PHONO', 'PLAYSTATION', 'PLAYSTATION 3',
      'PLAYSTATION 4', 'SATELLITE', 'SMARTCAST', 'TUNER', 'TV', 'USB DAC', 'VIDEO 1', 'VIDEO 2',
      'VIDEO 3', 'XBOX'
    ];
  }

  /**
   * Returns default value map based on supported values
   * @return {Object}
   */
  get defaultValueMap() {
    return Object.fromEntries(this.supportedValues.map((value) => [value, value.replace(/\s/g, '')]));
  }

  /**
   * Returns supported inputs based on parameter
   * @return {Array}
   */
  get supportedInputs() {
    return this.parameters[Parameter.SUPPORTED_INPUTS];
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.supportedInputs.length > 0;
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

    const inputs = parameters[Parameter.SUPPORTED_INPUTS] || [];
    // Update supported inputs parameter normalizing names and removing invalid values
    parameters[Parameter.SUPPORTED_INPUTS] = inputs
      .map((input) => this.supportedValues.find((value) => value.replace(/\s/g, '') === input.replace(/\s/g, '')))
      .filter(Boolean);
  }
}

module.exports = Input;
