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
 * Defines Alexa.StepSpeaker interface directive class
 * @extends AlexaDirective
 */
class AlexaStepSpeaker extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'StepSpeaker';
    this.map = {
      adjustVolume: 'adjustVolume',
      setMute: 'setMute'
    };
  }

  /**
   * Adjust volume
   */
  adjustVolume() {
    const volumeSteps = this.directive.payload.volumeSteps;
    const postItem = this.propertyMap.StepSpeaker.volume.item;
    this.getItemState(postItem).then((item) => {
      postItem.state = isNaN(item.state) ? Math.abs(volumeSteps) : parseInt(item.state) + volumeSteps;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      log.error('adjustVolume failed with error:', error);
      this.returnAlexaGenericErrorResponse();
    });
  }

  /**
   * Set mute
   */
  setMute() {
    const postItem = Object.assign(this.propertyMap.StepSpeaker.muted.item, {
      state: this.directive.payload.mute ? 'ON' : 'OFF'
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaStepSpeaker;
