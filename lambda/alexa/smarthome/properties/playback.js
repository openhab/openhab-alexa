/**
 * Copyright (c) 2010-2023 Contributors to the openHAB project
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

import { ItemType, ItemValue } from '#openhab/constants.js';
import { Parameter, ParameterType } from '../metadata.js';
import AlexaProperty from './property.js';

/**
 * Defines playback operation enum
 *  https://developer.amazon.com/docs/device-apis/alexa-playbackcontroller.html#discovery
 * @type {Object}
 */
export const PlaybackOperation = Object.freeze({
  PLAY: 'Play',
  PAUSE: 'Pause',
  STOP: 'Stop',
  START_OVER: 'StartOver',
  PREVIOUS: 'Previous',
  NEXT: 'Next',
  REWIND: 'Rewind',
  FAST_FORWARD: 'FastForward'
});

/**
 * Defines playback property class
 * @extends AlexaProperty
 */
export default class Playback extends AlexaProperty {
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
    return Object.keys(this.operationMappings);
  }

  /**
   * Returns operation mappings
   * @return {Object}
   */
  get operationMappings() {
    return {
      [PlaybackOperation.PLAY]: ItemValue.PLAY,
      [PlaybackOperation.PAUSE]: ItemValue.PAUSE,
      [PlaybackOperation.PREVIOUS]: ItemValue.PREVIOUS,
      [PlaybackOperation.NEXT]: ItemValue.NEXT,
      [PlaybackOperation.REWIND]: ItemValue.REWIND,
      [PlaybackOperation.FAST_FORWARD]: ItemValue.FAST_FORWARD
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
    parameters[Parameter.SUPPORTED_OPERATIONS] = operations?.filter((value) => this.defaultOperations.includes(value));
  }
}
