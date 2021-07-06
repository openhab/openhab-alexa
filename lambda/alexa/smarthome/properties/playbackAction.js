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
const Playback = require('./playback');

/**
 * Defines playback action property class
 * @extends AlexaProperty
 */
class PlaybackAction extends AlexaProperty {
  /**
   * Defines pause action
   * @type {String}
   */
  static PAUSE = 'Pause';

  /**
   * Defines resume action
   * @type {String}
   */
  static RESUME = 'Resume';

  /**
   * Defines stop action
   * @type {String}
   */
  static STOP = 'Stop';

  /**
   * Returns action semantics
   * @return {Array}
   */
  static get actionSemantics() {
    return [PlaybackAction.PAUSE, PlaybackAction.RESUME, PlaybackAction.STOP];
  }

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
    return Object.values(this.actionMappings);
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
      Object.keys(this.actionMappings).includes(this.operationMappings[key])
    );
  }

  /**
   * Returns action mappings based on parameter
   * @return {Object}
   */
  get actionMappings() {
    return this.parameters[Parameter.ACTION_MAPPINGS] || {};
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
    // Get action name using operation mappings
    const action = this.operationMappings[value];
    // Determine openhab command using action mappings
    //  { Resume: '<ohCommandResume>', Pause: '<ohCommandPause>', Stop: '<ohCommandStop>' }
    value = this.actionMappings[action];
    // Return command map value from parent if defined, otherwise unchanged value
    //  This is used to remap some of the device attributes action mappings commands (e.g. VacuumMode)
    return super.getCommand(value) || value;
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
    // Update action mappings parameter removing unsupported action semantics
    parameters[Parameter.ACTION_MAPPINGS] = Object.entries(actionMappings)
      .filter(([action]) => PlaybackAction.actionSemantics.includes(action))
      .reduce((actions, [action, mapping]) => ({ ...actions, [action]: mapping }), undefined);
  }
}

module.exports = PlaybackAction;
