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

const { ItemType, ItemValue } = require('@openhab/constants');
const { Parameter, ParameterType } = require('../metadata');
const DecoupleState = require('./decoupleState');

/**
 * Defines lock state property class
 * @extends DecoupleState
 */
class LockState extends DecoupleState {
  /**
   * Defines locked state
   * @type {String}
   */
  static LOCKED = 'LOCKED';

  /**
   * Defines unlocked state
   * @type {String}
   */
  static UNLOCKED = 'UNLOCKED';

  /**
   * Defines jammed state
   * @type {String}
   */
  static JAMMED = 'JAMMED';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return this.tag === DecoupleState.TAG_NAME
      ? [ItemType.CONTACT, ItemType.NUMBER, ItemType.STRING, ItemType.SWITCH]
      : [ItemType.SWITCH];
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
   * Returns supported values
   *  https://developer.amazon.com/docs/device-apis/alexa-lockcontroller.html#lockState-property
   * @return {Array}
   */
  get supportedValues() {
    return [LockState.LOCKED, LockState.UNLOCKED, LockState.JAMMED];
  }

  /**
   * Returns default value map based on item type
   * @return {Object}
   */
  get defaultValueMap() {
    switch (this.item.type) {
      case ItemType.CONTACT:
        return { LOCKED: ItemValue.CLOSED, UNLOCKED: ItemValue.OPEN };
      case ItemType.NUMBER:
        return { LOCKED: 1, UNLOCKED: 2, JAMMED: 3 };
      case ItemType.STRING:
        return { LOCKED: 'locked', UNLOCKED: 'unlocked', JAMMED: 'jammed' };
      case ItemType.SWITCH:
        return { LOCKED: ItemValue.ON, UNLOCKED: ItemValue.OFF };
      default:
        return {};
    }
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
    // Return inverted command if property inverted
    if (this.inverted) {
      return value === ItemValue.OFF ? ItemValue.ON : ItemValue.OFF;
    }

    return value;
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {String}
   */
  getState(value) {
    // Get state map value from parent method
    value = super.getState(value);

    // Return if value not defined
    if (typeof value === 'undefined') {
      return;
    }

    // Invert value for contact/switch item types if property inverted
    if (this.inverted && (this.item.type === ItemType.CONTACT || this.item.type === ItemType.SWITCH)) {
      value = value === LockState.UNLOCKED ? LockState.LOCKED : LockState.UNLOCKED;
    }

    return value;
  }
}

module.exports = LockState;
