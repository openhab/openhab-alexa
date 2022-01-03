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
 * Defines percentage property class
 * @extends AlexaProperty
 */
class Percentage extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.DIMMER, ItemType.ROLLERSHUTTER];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.INVERTED]: ParameterType.BOOLEAN
    };
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
    // Invert value if property inverted
    if (this.inverted) {
      value = (isDelta ? 0 : 100) - value;
    }

    return value;
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Number}
   */
  getState(value) {
    // Invert value if property inverted
    if (this.inverted) {
      value = 100 - value;
    }

    // Return state if numerical value
    if (!isNaN(value)) {
      return parseInt(value);
    }
  }
}

module.exports = Percentage;
