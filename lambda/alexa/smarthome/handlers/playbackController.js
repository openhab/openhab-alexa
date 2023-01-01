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

import { Interface } from '../constants.js';
import { InvalidValueError } from '../errors.js';
import AlexaHandler from './handler.js';

/**
 * Defines Alexa.PlaybackController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-playbackcontroller.html#directives
 * @extends AlexaHandler
 */
export default class PlaybackController extends AlexaHandler {
  /**
   * Defines fast forward directive
   * @type {String}
   */
  static FAST_FORWARD = 'FastForward';

  /**
   * Defines next directive
   * @type {String}
   */
  static NEXT = 'Next';

  /**
   * Defines pause directive
   * @type {String}
   */
  static PAUSE = 'Pause';

  /**
   * Defines play directive
   * @type {String}
   */
  static PLAY = 'Play';

  /**
   * Defines previous directive
   * @type {String}
   */
  static PREVIOUS = 'Previous';

  /**
   * Defines rewind directive
   * @type {String}
   */
  static REWIND = 'Rewind';

  /**
   * Defines start over directive
   * @type {String}
   */
  static START_OVER = 'StartOver';

  /**
   * Defines stop directive
   * @type {String}
   */
  static STOP = 'Stop';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_PLAYBACK_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [PlaybackController.FAST_FORWARD]: this.setPlayback,
      [PlaybackController.NEXT]: this.setPlayback,
      [PlaybackController.PAUSE]: this.setPlayback,
      [PlaybackController.PLAY]: this.setPlayback,
      [PlaybackController.PREVIOUS]: this.setPlayback,
      [PlaybackController.REWIND]: this.setPlayback,
      [PlaybackController.START_OVER]: this.setPlayback,
      [PlaybackController.STOP]: this.setPlayback
    };
  }

  /**
   * Sets playback
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setPlayback(directive, openhab) {
    const { properties } = directive.endpoint.getCapability({ interface: directive.namespace });
    const operation = directive.name;

    // Determine playback property based on requested operation
    const property = properties.find((property) => property.supportedOperations.includes(operation));

    // Throw invalid value error if playback property not defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError(`Playback ${operation} is not supported.`);
    }

    const command = property.getCommand(operation);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }
}
