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

const { Binding, ItemType, ItemValue } = require('@openhab/constants');
const { Parameter, ParameterType } = require('../metadata');
const AlexaProperty = require('./property');

/**
 * Defines thermostat mode property class
 * @extends AlexaProperty
 */
class ThermostatMode extends AlexaProperty {
  /**
   * Defines auto mode
   * @type {String}
   */
  static AUTO = 'AUTO';

  /**
   * Defines cool mode
   * @type {String}
   */
  static COOL = 'COOL';

  /**
   * Defines heat mode
   * @type {String}
   */
  static HEAT = 'HEAT';

  /**
   * Defines eco mode
   * @type {String}
   */
  static ECO = 'ECO';

  /**
   * Defines off mode
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
      [Parameter.BINDING]: ParameterType.STRING,
      [Parameter.SUPPORTED_MODES]: ParameterType.LIST,
      [Parameter.SUPPORTS_SETPOINT_MODE]: ParameterType.BOOLEAN
    };
  }

  /**
   * Returns supported values
   *  https://developer.amazon.com/docs/device-apis/alexa-property-schemas.html#thermostat-mode-values
   * @return {Array}
   */
  get supportedValues() {
    return [ThermostatMode.AUTO, ThermostatMode.COOL, ThermostatMode.HEAT, ThermostatMode.ECO, ThermostatMode.OFF];
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.supportedModes.length > 0;
  }

  /**
   * Returns default value map
   * @return {Object}
   */
  get defaultValueMap() {
    // Return default value map based on binding property if defined
    switch (this.binding) {
      case Binding.BROADLINK_THERMOSTAT:
        return {
          [ThermostatMode.HEAT]: 'manual',
          [ThermostatMode.AUTO]: 'auto'
        };
      case Binding.DAIKIN:
        return {
          [ThermostatMode.HEAT]: 'HEAT',
          [ThermostatMode.COOL]: 'COLD',
          [ThermostatMode.AUTO]: 'AUTO'
        };
      case Binding.ECOBEE:
        return {
          [ThermostatMode.OFF]: 'off',
          [ThermostatMode.HEAT]: 'heat',
          [ThermostatMode.COOL]: 'cool',
          [ThermostatMode.AUTO]: 'auto'
        };
      case Binding.INSTEON:
        return {
          [ThermostatMode.OFF]: 0,
          [ThermostatMode.HEAT]: 1,
          [ThermostatMode.COOL]: 2,
          [ThermostatMode.AUTO]: 3
        };
      case Binding.MAX:
        return {
          [ThermostatMode.HEAT]: 'MANUAL',
          [ThermostatMode.AUTO]: 'AUTOMATIC',
          [ThermostatMode.ECO]: 'VACATION'
        };
      case Binding.NEST:
        return {
          [ThermostatMode.OFF]: 'OFF',
          [ThermostatMode.HEAT]: 'HEAT',
          [ThermostatMode.COOL]: 'COOL',
          [ThermostatMode.AUTO]: 'HEAT_COOL',
          [ThermostatMode.ECO]: 'ECO'
        };
      case Binding.RADIO_THERMOSTAT:
        return {
          [ThermostatMode.OFF]: 0,
          [ThermostatMode.HEAT]: 1,
          [ThermostatMode.COOL]: 2,
          [ThermostatMode.AUTO]: 3
        };
      case Binding.VENSTAR_THERMOSTAT:
        return {
          [ThermostatMode.OFF]: 'off',
          [ThermostatMode.HEAT]: 'heat',
          [ThermostatMode.COOL]: 'cool',
          [ThermostatMode.AUTO]: 'auto'
        };
      case Binding.ZWAVE:
        return {
          [ThermostatMode.OFF]: 0,
          [ThermostatMode.HEAT]: 1,
          [ThermostatMode.COOL]: 2,
          [ThermostatMode.AUTO]: 3
        };
    }
    // Return default value map based on item type otherwise
    switch (this.item.type) {
      case ItemType.NUMBER:
        return {
          [ThermostatMode.OFF]: 0,
          [ThermostatMode.HEAT]: 1,
          [ThermostatMode.COOL]: 2,
          [ThermostatMode.AUTO]: 3,
          [ThermostatMode.ECO]: 4
        };
      case ItemType.STRING:
        return {
          [ThermostatMode.OFF]: 'off',
          [ThermostatMode.HEAT]: 'heat',
          [ThermostatMode.COOL]: 'cool',
          [ThermostatMode.AUTO]: 'auto',
          [ThermostatMode.ECO]: 'eco'
        };
      case ItemType.SWITCH:
        return {
          [ThermostatMode.OFF]: ItemValue.OFF,
          [ThermostatMode.HEAT]: ItemValue.ON
        };
      default:
        return {};
    }
  }

  /**
   * Returns default modes based on value map
   * @return {Array}
   */
  get defaultModes() {
    return Object.keys(this.valueMap);
  }

  /**
   * Returns binding based on parameter
   * @return {Array}
   */
  get binding() {
    return this.parameters[Parameter.BINDING];
  }

  /**
   * Returns supported modes based on parameter
   * @return {Array}
   */
  get supportedModes() {
    return this.parameters[Parameter.SUPPORTED_MODES] || this.defaultModes;
  }

  /**
   * Returns if supports setpoint mode based on parameter
   * @return {Boolean}
   */
  get supportsSetpointMode() {
    return this.parameters[Parameter.SUPPORTS_SETPOINT_MODE] !== false;
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

    const binding = parameters[Parameter.BINDING];
    // Update binding parameter using item channel metadata value if not defined
    parameters[Parameter.BINDING] =
      binding || (item.metadata && item.metadata.channel && item.metadata.channel.value.split(':')[0]);

    const modes = parameters[Parameter.SUPPORTED_MODES];
    // Update supported modes parameter removing unsupported values if defined
    parameters[Parameter.SUPPORTED_MODES] = modes && modes.filter((value) => this.supportedValues.includes(value));
  }
}

module.exports = ThermostatMode;
