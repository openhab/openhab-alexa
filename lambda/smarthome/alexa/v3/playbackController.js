/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
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
   * Sends a playback command (PLAY, PASUE, REWIND, etc..) to a string or player item
   */
  setPlayback() {
    const postItem = Object.assign({}, this.propertyMap.PlaybackController.playback.item, {
      state: this.directive.header.name.toUpperCase()
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaPlaybackController;
