/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
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

const AlexaDirective = require('../directive.js');

/**
 * Defines Alexa.PlaybackController interface directive class
 * @extends AlexaDirective
 */
class AlexaPlaybackController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'PlaybackController';
    this.map = {
      fastForward: 'setPlayback',
      next: 'setPlayback',
      pause: 'setPlayback',
      play: 'setPlayback',
      previous: 'setPlayback',
      rewind: 'setPlayback',
      startOver: undefined,
      stop: undefined
    };
  }

  /**
   * Sends a playback command (PLAY, PASUE, REWIND, etc..) to a player item
   */
  setPlayback() {
    const postItem = Object.assign({}, this.propertyMap.PlaybackController.playback.item, {
      state: this.directive.header.name.toUpperCase()
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaPlaybackController;
