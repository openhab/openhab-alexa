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

const { clamp } = require('@root/utils');
const { ItemType, ItemValue } = require('@openhab/constants');
const { Parameter, ParameterType } = require('../metadata');
const AlexaProperty = require('./property');

/**
 * Defines arm state authorization type enum
 * @type {Object}
 */
const AuthType = Object.freeze({
  FOUR_DIGIT_PIN: 'FOUR_DIGIT_PIN'
});

/**
 * Defines arm state property class
 * @extends AlexaProperty
 */
class ArmState extends AlexaProperty {
  /**
   * Defines maximum exit delay in seconds
   * @type {Number}
   */
  static #EXIT_DELAY_MAXIMUM = 255;

  /**
   * Defines pin code pattern
   * @type {RegExp}
   */
  static #PIN_CODE_PATTERN = /^\d{4}$/;

  /**
   * Defines armed away state
   * @type {String}
   */
  static ARMED_AWAY = 'ARMED_AWAY';

  /**
   * Defines armed stay state
   * @type {String}
   */
  static ARMED_STAY = 'ARMED_STAY';

  /**
   * Defines armed night state
   * @type {String}
   */
  static ARMED_NIGHT = 'ARMED_NIGHT';

  /**
   * Defines disarmed state
   * @type {String}
   */
  static DISARMED = 'DISARMED';

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
      [Parameter.SUPPORTED_ARM_STATES]: ParameterType.LIST,
      [Parameter.PIN_CODES]: ParameterType.LIST,
      [Parameter.EXIT_DELAY]: ParameterType.INTEGER
    };
  }

  /**
   * Returns supported values
   *  https://developer.amazon.com/docs/device-apis/alexa-securitypanelcontroller.html#armstate-property
   * @return {Array}
   */
  get supportedValues() {
    return [ArmState.ARMED_AWAY, ArmState.ARMED_STAY, ArmState.ARMED_NIGHT, ArmState.DISARMED];
  }

  /**
   * Returns default value map based on item type
   * @return {Object}
   */
  get defaultValueMap() {
    switch (this.item.type) {
      case ItemType.NUMBER:
        return {
          [ArmState.DISARMED]: 0,
          [ArmState.ARMED_STAY]: 1,
          [ArmState.ARMED_AWAY]: 2,
          [ArmState.ARMED_NIGHT]: 3
        };
      case ItemType.STRING:
        return {
          [ArmState.DISARMED]: 'disarmed',
          [ArmState.ARMED_STAY]: 'stay',
          [ArmState.ARMED_AWAY]: 'away',
          [ArmState.ARMED_NIGHT]: 'night'
        };
      case ItemType.SWITCH:
        return {
          [ArmState.DISARMED]: ItemValue.OFF,
          [ArmState.ARMED_STAY]: ItemValue.ON
        };
      default:
        return {};
    }
  }

  /**
   * Returns default arm states based on value map
   * @return {Array}
   */
  get defaultArmStates() {
    return Object.keys(this.valueMap);
  }

  /**
   * Returns supported arm states based on parameter
   * @return {Array}
   */
  get supportedArmStates() {
    return this.parameters[Parameter.SUPPORTED_ARM_STATES] || this.defaultArmStates;
  }

  /**
   * Returns pin codes based on parameter
   * @return {Array}
   */
  get pinCodes() {
    return this.parameters[Parameter.PIN_CODES] || [];
  }

  /**
   * Returns exit delay in seconds based on parameter
   * @return {Number}
   */
  get exitDelayInSeconds() {
    return this.parameters[Parameter.EXIT_DELAY];
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.supportedArmStates.length >= 2 && this.supportedArmStates.includes(ArmState.DISARMED);
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

    const states = parameters[Parameter.SUPPORTED_ARM_STATES];
    // Update supported arm states parameter removing unsupported values if defined
    parameters[Parameter.SUPPORTED_ARM_STATES] =
      states && states.filter((value) => this.supportedValues.includes(value));

    const pinCodes = parameters[Parameter.PIN_CODES];
    // Update pin codes parameter removing invalid values if defined
    parameters[Parameter.PIN_CODES] = pinCodes && pinCodes.filter((value) => ArmState.#PIN_CODE_PATTERN.test(value));

    const exitDelay = parameters[Parameter.EXIT_DELAY];
    // Update exit delay parameters within alexa supported spread if valid, otherwise set to undefined
    parameters[Parameter.EXIT_DELAY] = !isNaN(exitDelay)
      ? clamp(exitDelay, 0, ArmState.#EXIT_DELAY_MAXIMUM)
      : undefined;
  }
}

module.exports = ArmState;
module.exports.AuthType = AuthType;
