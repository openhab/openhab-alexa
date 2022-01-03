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
const { Property } = require('../constants');
const { Parameter, ParameterType } = require('../metadata');
const AlexaProperty = require('./property');

/**
 * Defines thermostat hold property class
 * @extends AlexaProperty
 */
class ThermostatHold extends AlexaProperty {
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
      [Parameter.INVERTED]: ParameterType.BOOLEAN,
      [Parameter.REQUIRES_SETPOINT_HOLD]: ParameterType.BOOLEAN
    };
  }

  /**
   * Returns supported values
   * @return {Array}
   */
  get supportedValues() {
    return [ThermostatHold.ON, ThermostatHold.OFF];
  }

  /**
   * Returns required linked properties
   * @return {Array}
   */
  get requiredLinkedProperties() {
    return [{ name: Property.THERMOSTAT_MODE }];
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }

  /**
   * Returns default value map based on item type
   * @return {Object}
   */
  get defaultValueMap() {
    switch (this.item.type) {
      case ItemType.NUMBER:
        return { [ThermostatHold.OFF]: 0, [ThermostatHold.ON]: 1 };
      case ItemType.STRING:
        return { [ThermostatHold.OFF]: 'schedule', [ThermostatHold.ON]: 'hold' };
      case ItemType.SWITCH:
        return { [ThermostatHold.OFF]: ItemValue.OFF, [ThermostatHold.ON]: ItemValue.ON };
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
   * Returns if requires setpoint hold based on parameter
   * @return {Boolean}
   */
  get requiresSetpointHold() {
    return this.parameters[Parameter.REQUIRES_SETPOINT_HOLD] === true;
  }

  /**
   * Returns openhab command
   * @param  {String} value
   * @return {String}
   */
  getCommand(value) {
    // Invert command value if property inverted and switch item type
    if (this.inverted && this.item.type === ItemType.SWITCH) {
      value = value === ThermostatHold.OFF ? ThermostatHold.ON : ThermostatHold.OFF;
    }

    // Return command map value from parent method
    return super.getCommand(value);
  }
}

module.exports = ThermostatHold;
