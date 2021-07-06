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
const { Parameter, ParameterType } = require('../metadata');
const AlexaProperty = require('./property');

/**
 * Defines channel property class
 * @extends AlexaProperty
 */
class Channel extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.NUMBER, ItemType.STRING];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.CHANNEL_MAPPINGS]: ParameterType.MAP
    };
  }

  /**
   * Returns channel mappings list
   * @return {Object}
   */
  get channelMappings() {
    return this.parameters[Parameter.CHANNEL_MAPPINGS] || {};
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Object}
   */
  getState(value) {
    // Return formatted state if value defined
    if (typeof value !== 'undefined') {
      return { number: value.toString() };
    }
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

    const channels = parameters[Parameter.CHANNEL_MAPPINGS] || {};
    // Update channel mappings parameter removing invalid mappings if defined
    parameters[Parameter.CHANNEL_MAPPINGS] = Object.entries(channels)
      .filter(([, number]) => !isNaN(number))
      .reduce((channels, [name, number]) => ({ ...channels, [name.toUpperCase()]: number }), undefined);
  }
}

module.exports = Channel;
