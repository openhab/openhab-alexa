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
 * Defines playback property class
 * @extends AlexaProperty
 */
class Playback extends AlexaProperty {
  /**
   * Defines play operation
   * @type {String}
   */
  static PLAY = 'Play';

  /**
   * Defines pause operation
   * @type {String}
   */
  static PAUSE = 'Pause';

  /**
   * Defines next operation
   * @type {String}
   */
  static NEXT = 'Next';

  /**
   * Defines previous operation
   * @type {String}
   */
  static PREVIOUS = 'Previous';

  /**
   * Defines fast forward operation
   * @type {String}
   */
  static FAST_FORWARD = 'FastForward';

  /**
   * Defines rewind operation
   * @type {String}
   */
  static REWIND = 'Rewind';

  /**
   * Defines stop operation
   * @type {String}
   */
  static STOP = 'Stop';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.PLAYER];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.SUPPORTED_OPERATIONS]: ParameterType.LIST
    };
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.supportedOperations.length > 0;
  }

  /**
   * Returns default operations
   * @return {Array}
   */
  get defaultOperations() {
    return [Playback.PLAY, Playback.PAUSE, Playback.NEXT, Playback.PREVIOUS, Playback.FAST_FORWARD, Playback.REWIND];
  }

  /**
   * Returns operation mappings
   * @return {Object}
   */
  get operationMappings() {
    return {
      [Playback.PLAY]: ItemValue.PLAY,
      [Playback.PAUSE]: ItemValue.PAUSE,
      [Playback.NEXT]: ItemValue.NEXT,
      [Playback.PREVIOUS]: ItemValue.PREVIOUS,
      [Playback.FAST_FORWARD]: ItemValue.FAST_FORWARD,
      [Playback.REWIND]: ItemValue.REWIND
    };
  }

  /**
   * Returns supported operations based on parameters
   * @return {Array}
   */
  get supportedOperations() {
    return this.parameters[Parameter.SUPPORTED_OPERATIONS] || this.defaultOperations;
  }

  /**
   * Returns openhab command
   * @param  {String} value
   * @return {String}
   */
  getCommand(value) {
    return this.operationMappings[value];
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

    const operations = parameters[Parameter.SUPPORTED_OPERATIONS];
    // Update supported operations parameter if defined, removing invalid values
    parameters[Parameter.SUPPORTED_OPERATIONS] =
      operations && operations.filter((value) => this.defaultOperations.includes(value));
  }
}

module.exports = Playback;
