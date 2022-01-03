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
const AlexaProperty = require('./property');

/**
 * Defines binary state property class
 * @extends AlexaProperty
 */
class BinaryState extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return this.supportsCommands ? [ItemType.SWITCH] : [ItemType.CONTACT, ItemType.SWITCH];
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
   * Returns if supports commands
   * @return {Boolean}
   */
  get supportsCommands() {
    return false;
  }

  /**
   * Returns default value map based on item type
   * @return {Object}
   */
  get defaultValueMap() {
    return this.item.type === ItemType.CONTACT
      ? { [this.supportedValues[0]]: ItemValue.OPEN, [this.supportedValues[1]]: ItemValue.CLOSED }
      : { [this.supportedValues[0]]: ItemValue.ON, [this.supportedValues[1]]: ItemValue.OFF };
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
    // Invert command value if property inverted
    if (this.inverted) {
      value = this.supportedValues[0] === value ? this.supportedValues[1] : this.supportedValues[0];
    }

    // Return command map value from parent method
    return super.getCommand(value);
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Object}
   */
  getState(value) {
    // Get state map value from parent method
    value = super.getState(value);

    // Return if value not defined
    if (typeof value === 'undefined') {
      return;
    }

    // Invert value if property inverted
    if (this.inverted) {
      value = this.supportedValues[0] === value ? this.supportedValues[1] : this.supportedValues[0];
    }

    return value;
  }
}

module.exports = BinaryState;
