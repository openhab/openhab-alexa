/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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

const { Interface, Property } = require('../constants');
const { InvalidValueError } = require('../errors');
const AlexaHandler = require('./handler');
const Speaker = require('./speaker');

/**
 * Defines Alexa.StepSpeaker interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-stepspeaker.html#directives
 * @extends AlexaHandler
 */
class StepSpeaker extends AlexaHandler {
  /**
   * Defines adjust volume directive
   * @type {String}
   */
  static ADJUST_VOLUME = 'AdjustVolume';

  /**
   * Defines set mute directive
   * @type {String}
   */
  static SET_MUTE = 'SetMute';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_STEP_SPEAKER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [StepSpeaker.ADJUST_VOLUME]: this.adjustVolume,
      [StepSpeaker.SET_MUTE]: Speaker.setMute
    };
  }

  /**
   * Adjusts step speaker volume
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustVolume(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.VOLUME
    });

    // Throw invalid value error if no speaker volume property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('No volume property defined.');
    }

    const { item, increment } = property;

    // Define adjusted volume using either volume default and increment parameter, if defined, otherwise volume value
    const volumeSteps = directive.payload.volumeSteps;
    const volumeStepsDefault = directive.payload.volumeStepsDefault;
    const volume = volumeStepsDefault && increment > 0 ? (volumeSteps >= 0 ? 1 : -1) * increment : volumeSteps;

    await openhab.sendCommand(item.name, volume);

    return directive.response();
  }
}

module.exports = StepSpeaker;
