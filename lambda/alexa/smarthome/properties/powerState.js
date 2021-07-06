/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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
const AlexaProperty = require('./property');

/**
 * Defines power state property class
 * @extends AlexaProperty
 */
class PowerState extends AlexaProperty {
  /**
   * Defines on power state
   * @type {String}
   */
  static ON = 'ON';

  /**
   * Defines off power state
   * @type {String}
   */
  static OFF = 'OFF';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.COLOR, ItemType.DIMMER, ItemType.NUMBER, ItemType.STRING, ItemType.SWITCH];
  }

  /**
   * Returns supported values
   * @return {Array}
   */
  get supportedValues() {
    return [PowerState.ON, PowerState.OFF];
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
    return !this.requiresValueMap || this.supportedValues.every((value) => typeof this.valueMap[value] !== 'undefined');
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

    return value;
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {String}
   */
  getState(value) {
    // Return if value not defined
    if (typeof value === 'undefined') {
      return;
    }

    // Return state based on value map if required
    if (this.requiresValueMap) {
      return value !== this.valueMap.OFF.toString() ? PowerState.ON : PowerState.OFF;
    }

    // Extract brightness level for color item type
    if (value.split(',').length === 3) {
      value = value.split(',').pop();
    }

    // Convert state if numerical value
    if (!isNaN(value)) {
      value = value > 0 ? PowerState.ON : PowerState.OFF;
    }

    return value;
  }
}

module.exports = PowerState;
