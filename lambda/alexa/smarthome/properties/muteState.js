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
 * Defines mute state property class
 * @extends AlexaProperty
 */
class MuteState extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.SWITCH];
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
    return this.parameters[Parameter.INVERTED] === true;
  }

  /**
   * Returns openhab command
   * @param  {Boolean} value
   * @return {String}
   */
  getCommand(value) {
    return this.inverted ^ value ? ItemValue.ON : ItemValue.OFF;
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Boolean}
   */
  getState(value) {
    // Return state if value defined
    if (typeof value !== 'undefined') {
      return this.inverted ? value === ItemValue.OFF : value === ItemValue.ON;
    }
  }
}

module.exports = MuteState;
