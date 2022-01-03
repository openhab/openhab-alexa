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

const { ItemType } = require('@openhab/constants');
const { Parameter, ParameterType } = require('../metadata');
const { CustomActionSemantic } = require('../semantics');
const AlexaProperty = require('./property');
const Playback = require('./playback');

/**
 * Defines playback action property class
 * @extends AlexaProperty
 */
class PlaybackAction extends AlexaProperty {
  /**
   * Defines pause state
   * @type {String}
   */
  static PAUSE = 'PAUSE';

  /**
   * Defines resume state
   * @type {String}
   */
  static RESUME = 'RESUME';

  /**
   * Defines stop state
   * @type {String}
   */
  static STOP = 'STOP';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.DIMMER, ItemType.NUMBER, ItemType.ROLLERSHUTTER, ItemType.STRING, ItemType.SWITCH];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.ACTION_MAPPINGS]: ParameterType.MAP
    };
  }

  /**
   * Returns supported alexa values
   * @return {Array}
   */
  get supportedValues() {
    return [PlaybackAction.RESUME, PlaybackAction.PAUSE, PlaybackAction.STOP];
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
   * Returns supported operations
   * @return {Array}
   */
  get supportedOperations() {
    return Object.keys(this.operationMappings).filter((key) =>
      Object.keys(this.valueMap).includes(this.operationMappings[key])
    );
  }

  /**
   * Returns operation mappings
   * @return {Object}
   */
  get operationMappings() {
    return {
      [Playback.PLAY]: PlaybackAction.RESUME,
      [Playback.PAUSE]: PlaybackAction.PAUSE,
      [Playback.STOP]: PlaybackAction.STOP
    };
  }

  /**
   * Returns openhab command
   * @param  {String} value
   * @return {String}
   */
  getCommand(value) {
    // Return command map value from parent method based on operation mappings
    return super.getCommand(this.operationMappings[value]);
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

    const actionMappings = parameters[Parameter.ACTION_MAPPINGS] || {};
    // Iterate over action mappings parameter updating value mapping parameters based on supported action semantics
    for (const [action, value] of Object.entries(actionMappings)) {
      switch (action) {
        case CustomActionSemantic.RESUME:
          parameters[PlaybackAction.RESUME] = value;
          break;
        case CustomActionSemantic.PAUSE:
          parameters[PlaybackAction.PAUSE] = value;
          break;
        case CustomActionSemantic.STOP:
          parameters[PlaybackAction.STOP] = value;
          break;
      }
    }
    // Delete action mappings parameter
    delete parameters[Parameter.ACTION_MAPPINGS];
  }
}

module.exports = PlaybackAction;
