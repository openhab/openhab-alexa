/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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
    const postItem = Object.assign({}, this.propertyMap.Speaker.volume.item, {
      state: this.directive.payload.volume
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust volume
   */
  adjustVolume() {
    const postItem = Object.assign({}, this.propertyMap.Speaker.volume.item);
    const defaultIncrement = parseInt(this.propertyMap.Speaker.volume.parameters.increment);
    const volumeAdjust = this.directive.payload.volume;
    const volumeDefault = this.directive.payload.volumeDefault;
    const volumeIncrement = volumeDefault && defaultIncrement > 0 ?
      (volumeAdjust >= 0 ? 1 : -1) * defaultIncrement : volumeAdjust;

    this.getItemState(postItem).then((item) => {
      // Throw error if state not a number
      if (isNaN(item.state)) {
        throw {cause: 'Could not get numeric item state', item: item};
      }

      postItem.state = parseInt(item.state) + volumeIncrement;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      this.returnAlexaGenericErrorResponse(error);
    });
  }

  /**
   * Set Mute
   */
  setMute() {
    const postItem = Object.assign({}, this.propertyMap.Speaker.muted.item, {
      state: this.directive.payload.mute ? 'ON' : 'OFF'
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaSpeaker;
