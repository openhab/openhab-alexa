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
    const postItem = Object.assign({}, this.propertyMap.StepSpeaker.volume.item, {
      state: this.directive.payload.volumeSteps
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Set mute
   */
  setMute() {
    const postItem = Object.assign({}, this.propertyMap.StepSpeaker.muted.item, {
      state: this.directive.payload.mute ? 'ON' : 'OFF'
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaStepSpeaker;
