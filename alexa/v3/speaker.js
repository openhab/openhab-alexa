/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

const log = require('@lib/log.js');
const AlexaDirective = require('../directive.js');

/**
 * Defines Alexa.Speaker interface directive class
 * @extends AlexaDirective
 */
class AlexaSpeaker extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'Speaker';
    this.map = {
      setVolume: 'setVolume',
      adjustVolume: 'adjustVolume',
      setMute: 'setMute'
    };
  }

  /**
   * Set volume
   */
  setVolume() {
    const postItem = Object.assign(this.propertyMap.Speaker.volume.item, {
      state: this.directive.payload.volume
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust volume
   */
  adjustVolume() {
    const postItem = this.propertyMap.Speaker.volume.item;
    const defaultIncrement = parseInt(this.propertyMap.Speaker.volume.parameters.increment);
    const volumeAdjust = this.directive.payload.volume;
    const volumeDefault = this.directive.payload.volumeDefault;
    const volumeIncrement = volumeDefault && defaultIncrement > 0 ?
      (volumeAdjust >= 0 ? 1 : -1) * defaultIncrement : volumeAdjust;

    this.getItemState(postItem).then((item) => {
      postItem.state = isNaN(item.state) ? Math.abs(volumeIncrement) : parseInt(item.state) + volumeIncrement;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      log.error('adjustVolume failed with error:', error);
      this.returnAlexaGenericErrorResponse();
    });
  }

  /**
   * Set Mute
   */
  setMute() {
    const postItem = Object.assign(this.propertyMap.Speaker.muted.item, {
      state: this.directive.payload.mute ? 'ON' : 'OFF'
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaSpeaker;
