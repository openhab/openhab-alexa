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
    const defaultIncrement = parseInt(this.propertyMap.StepSpeaker.volume.parameters.increment);
    const volumeSteps = this.directive.payload.volumeSteps;
    const volumeStepsDefault = this.directive.payload.volumeStepsDefault;
    const postItem = Object.assign({}, this.propertyMap.StepSpeaker.volume.item, {
      state: volumeStepsDefault && defaultIncrement > 0 ? (volumeSteps >= 0 ? 1 : -1) * defaultIncrement : volumeSteps
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
