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
const Generic = require('./generic');

/**
 * Defines toggle state property class
 * @extends Generic
 */
class ToggleState extends Generic {
  /**
   * Defines on state
   * @type {String}
   */
  static ON = 'ON';

  /**
   * Defines off state
   * @type {String}
   */
  static OFF = 'OFF';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.NUMBER, ItemType.STRING, ItemType.SWITCH];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      ...super.supportedParameters,
      [Parameter.INVERTED]: ParameterType.BOOLEAN
    };
  }

  /**
   * Returns supported values
   * @return {Array}
   */
  get supportedValues() {
    return [ToggleState.ON, ToggleState.OFF];
  }

  /**
   * Returns if require value map
   * @return {Boolean}
   */
  get requiresValueMap() {
    return this.item.type === ItemType.NUMBER || this.item.type === ItemType.STRING;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return super.isValid && (!this.requiresValueMap || this.hasSupportedValuesMapped);
  }

  /**
   * Returns inverted based on parameter
   * @return {Boolean}
   */
  get inverted() {
    return this.parameters[Parameter.INVERTED] === true;
  }

  /**
   * Returns openhab command
   * @param  {String} value
   * @return {String}
   */
  getCommand(value) {
    // Return command using value map if required
    if (this.requiresValueMap) {
      return this.valueMap[value];
    }

    // Return inverted command if property inverted
    if (this.inverted) {
      return value === ToggleState.OFF ? ToggleState.ON : ToggleState.OFF;
    }

    return value;
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {String}
   */
  getState(value) {
    // Return state based on value map if required
    if (this.requiresValueMap) {
      return value !== this.valueMap.OFF.toString() ? ToggleState.ON : ToggleState.OFF;
    }

    // Return inverted state if property inverted
    if (this.inverted) {
      return value === ToggleState.OFF ? ToggleState.ON : value === ToggleState.ON ? ToggleState.OFF : undefined;
    }

    return value;
  }
}

module.exports = ToggleState;
