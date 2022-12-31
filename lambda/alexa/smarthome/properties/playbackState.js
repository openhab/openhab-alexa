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

import { ItemType, ItemValue } from '#openhab/constants.js';
import { Parameter, ParameterType } from '../metadata.js';
import AlexaProperty from './property.js';

/**
 * Defines playback state property class
 * @extends AlexaProperty
 */
export default class PlaybackState extends AlexaProperty {
  /**
   * Defines playing state
   * @type {String}
   */
  static PLAYING = 'PLAYING';

  /**
   * Defines paused state
   * @type {String}
   */
  static PAUSED = 'PAUSED';

  /**
   * Defines stopped state
   * @type {String}
   */
  static STOPPED = 'STOPPED';

  /**
   * Defines stop tag name
   * @type {String}
   */
  static TAG_STOP = 'stop';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return this.tag === PlaybackState.TAG_STOP ? [ItemType.SWITCH] : [ItemType.PLAYER];
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
   * Returns supported tags
   * @return {Array}
   */
  get supportedTags() {
    return [PlaybackState.TAG_STOP];
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.isReportable;
  }

  /**
   * Returns inverted based on parameter
   * @return {Boolean}
   */
  get inverted() {
    return this.parameters[Parameter.INVERTED] === true;
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Object}
   */
  getState(value) {
    let state;

    if (this.item.type === ItemType.PLAYER) {
      if (value === ItemValue.PLAY) {
        state = PlaybackState.PLAYING;
      } else if (value === ItemValue.PAUSE) {
        state = PlaybackState.PAUSED;
      }
    } else {
      if (value === (this.inverted ? ItemValue.OFF : ItemValue.ON)) {
        state = PlaybackState.STOPPED;
      }
    }

    if (typeof state !== 'undefined') {
      return { state };
    }
  }
}
