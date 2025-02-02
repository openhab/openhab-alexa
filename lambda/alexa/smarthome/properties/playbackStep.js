/**
 * Copyright (c) 2010-2025 Contributors to the openHAB project
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

import { ItemType } from '#openhab/constants.js';
import { PlaybackOperation } from './playback.js';
import AlexaProperty from './property.js';

/**
 * Defines playback step property class
 * @extends AlexaProperty
 */
export default class PlaybackStep extends AlexaProperty {
  /**
   * Defines playback step play
   * @type {String}
   */
  static PLAY = 'PLAY';

  /**
   * Defines playback step pause
   * @type {String}
   */
  static PAUSE = 'PAUSE';

  /**
   * Defines playback step stop
   * @type {String}
   */
  static STOP = 'STOP';

  /**
   * Defines playback step stop
   * @type {String}
   */
  static START_OVER = 'START_OVER';

  /**
   * Defines playback step previous
   * @type {String}
   */
  static PREVIOUS = 'PREVIOUS';

  /**
   * Defines playback step next
   * @type {String}
   */
  static NEXT = 'NEXT';

  /**
   * Defines playback step rewind
   * @type {String}
   */
  static REWIND = 'REWIND';

  /**
   * Defines playback step fast forward
   * @type {String}
   */
  static FAST_FORWARD = 'FAST_FORWARD';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.STRING];
  }

  /**
   * Returns supported values
   * @return {Array}
   */
  get supportedValues() {
    return Object.values(this.operationMappings);
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
      [PlaybackOperation.PLAY]: PlaybackStep.PLAY,
      [PlaybackOperation.PAUSE]: PlaybackStep.PAUSE,
      [PlaybackOperation.STOP]: PlaybackStep.STOP,
      [PlaybackOperation.START_OVER]: PlaybackStep.START_OVER,
      [PlaybackOperation.PREVIOUS]: PlaybackStep.PREVIOUS,
      [PlaybackOperation.NEXT]: PlaybackStep.NEXT,
      [PlaybackOperation.REWIND]: PlaybackStep.REWIND,
      [PlaybackOperation.FAST_FORWARD]: PlaybackStep.FAST_FORWARD
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
}
