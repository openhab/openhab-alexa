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

const { ItemType, ItemValue } = require('@openhab/constants');
const { Parameter, ParameterType } = require('../metadata');
const Generic = require('./generic');

/**
 * Defines toggle state property class
 * @extends Generic
 */
class ToggleState extends Generic {
  /**
   * Defines turn on action
   * @type {String}
   */
  static TURN_ON = 'TurnOn';

  /**
   * Defines turn off action
   * @type {String}
   */
  static TURN_OFF = 'TurnOff';

  /**
   * Defines on state
   * @type {String}
   */
  static ON = 'On';

  /**
   * Defines off state
   * @type {String}
   */
  static OFF = 'Off';

  /**
   * Returns action semantics
   * @return {Array}
   */
  static get actionSemantics() {
    return [ToggleState.TURN_ON, ToggleState.TURN_OFF];
  }

  /**
   * Returns state semantics
   * @return {Array}
   */
  static get stateSemantics() {
    return [ToggleState.ON, ToggleState.OFF];
  }

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.DIMMER, ItemType.NUMBER, ItemType.STRING, ItemType.SWITCH];
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
   * Returns if is non-controlable
   * @return {Boolean}
   */
  get isNonControllable() {
    return super.isNonControllable || !this.hasRequiredActionMappings;
  }

  /**
   * Returns if is retrievable
   * @return {Boolean}
   */
  get isRetrievable() {
    return super.isRetrievable && this.hasRequiredStateMappings;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return super.isValid && (this.hasRequiredActionMappings || this.hasRequiredStateMappings);
  }

  /**
   * Returns if property has required action mappings
   * @return {Boolean}
   */
  get hasRequiredActionMappings() {
    return !!this.actionMappings[ToggleState.TURN_ON] && !!this.actionMappings[ToggleState.TURN_OFF];
  }

  /**
   * Returns if property has required state mappings
   * @return {Boolean}
   */
  get hasRequiredStateMappings() {
    return !!this.stateMappings[ToggleState.ON] && !!this.stateMappings[ToggleState.OFF];
  }

  /**
   * Returns default action map based on item type
   * @return {Object}
   */
  get defaultActionMap() {
    return this.item.type === ItemType.SWITCH
      ? { [ToggleState.TURN_OFF]: ItemValue.OFF, [ToggleState.TURN_ON]: ItemValue.ON }
      : {};
  }

  /**
   * Returns default state map based on item type
   * @return {Object}
   */
  get defaultStateMap() {
    return this.item.type === ItemType.SWITCH
      ? { [ToggleState.OFF]: ItemValue.OFF, [ToggleState.ON]: ItemValue.ON }
      : {};
  }

  /**
   * Returns supported action semantics
   * @return {Array}
   */
  get supportedActionSemantics() {
    return [...super.supportedActionSemantics, ...ToggleState.actionSemantics];
  }

  /**
   * Returns supported state semantics
   * @return {Array}
   */
  get supportedStateSemantics() {
    return [...super.supportedStateSemantics, ...ToggleState.stateSemantics];
  }

  /**
   * Returns action mappings based on parameter
   * @return {Object}
   */
  get actionMappings() {
    return { ...this.defaultActionMap, ...this.parameters[Parameter.ACTION_MAPPINGS] };
  }

  /**
   * Returns state mappings based on parameter
   * @return {Object}
   */
  get stateMappings() {
    return { ...this.defaultStateMap, ...this.parameters[Parameter.STATE_MAPPINGS] };
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
    // Invert value for switch item type if property inverted
    if (this.inverted && this.item.type === ItemType.SWITCH) {
      value = value === ToggleState.TURN_OFF ? ToggleState.TURN_ON : ToggleState.TURN_OFF;
    }

    // Return openhab command using action mappings
    //  { TurnOff: '<ohCommandOff>', TurnOn: '<ohCommandOn>' }
    return this.actionMappings[value];
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {String}
   */
  getState(value) {
    // Determine alexa state using state mappings
    //  { Off: '<ohStateOff>', On: '<ohStateOnMinRange>:<ohStateOnMaxRange>' }
    //  { Off: '<ohStateOff>', On: '<ohStateOn1>|<ohStateOn2>|...' }
    value = Object.keys(this.stateMappings)
      .filter((state) => state === ToggleState.ON || state === ToggleState.OFF)
      .find((state) => {
        const mapping = this.stateMappings[state].toString();
        const range = mapping.split(':', 2);
        return range.length === 2 && range.every((value) => !isNaN(value))
          ? range[0] <= Number(value) && range[1] >= Number(value)
          : mapping.split('|').includes(String(value));
      });

    // Invert value for switch item type if property inverted
    if (this.inverted && this.item.type === ItemType.SWITCH) {
      value = value === ToggleState.OFF ? ToggleState.ON : value === ToggleState.ON ? ToggleState.OFF : undefined;
    }

    // Return state if value defined
    if (typeof value !== 'undefined') {
      return value.toUpperCase();
    }
  }
}

module.exports = ToggleState;
