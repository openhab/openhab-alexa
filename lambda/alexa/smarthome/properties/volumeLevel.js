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
 * Defines volume level property class
 * @extends AlexaProperty
 */
class VolumeLevel extends AlexaProperty {
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
      [Parameter.INCREMENT]: ParameterType.INTEGER
    };
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
}

module.exports = VolumeLevel;
