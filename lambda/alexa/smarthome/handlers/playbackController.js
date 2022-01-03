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

const { Interface } = require('../constants');
const { InvalidValueError } = require('../errors');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.PlaybackController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-playbackcontroller.html#directives
 * @extends AlexaHandler
 */
class PlaybackController extends AlexaHandler {
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
      [PlaybackController.START_OVER]: undefined,
      [PlaybackController.STOP]: this.setPlayback
    };
  }

  /**
   * Sets playback command
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setPlayback(directive, openhab) {
    const { properties } = directive.endpoint.getCapability({ interface: directive.namespace });
    const operation = directive.name;
    let item, command;

    // Determine playback item and command to send based on property supporting requested operation
    for (const property of properties) {
      if (property.supportedOperations.includes(operation)) {
        item = property.item;
        command = property.getCommand(operation);
        break;
      }
    }

    // Throw invalid value error if playback command not defined
    if (typeof command === 'undefined') {
      throw new InvalidValueError(`${operation} playback command is not supported.`);
    }

    await openhab.sendCommand(item.name, command);

    return directive.response();
  }
}

module.exports = PlaybackController;
