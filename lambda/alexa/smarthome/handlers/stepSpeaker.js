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

const { clamp } = require('@root/utils');
const { Interface, Property } = require('../constants');
const { InvalidValueError } = require('../errors');
const { VolumeStep, MuteStep } = require('../properties');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.StepSpeaker interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-stepspeaker.html#directives
 * @extends AlexaHandler
 */
class StepSpeaker extends AlexaHandler {
  /**
   * Defines volume steps limit per request
   * @type {Number}
   */
  static #VOLUME_STEPS_LIMIT = 10;

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
      [StepSpeaker.SET_MUTE]: this.setMute
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

    // Define volume steps based on directive payload volume steps default value
    const volumeStepsDefault = directive.payload.volumeStepsDefault;
    const volumeSteps = clamp(
      volumeStepsDefault ? (directive.payload.volumeSteps >= 0 ? 1 : -1) : directive.payload.volumeSteps,
      -StepSpeaker.#VOLUME_STEPS_LIMIT,
      StepSpeaker.#VOLUME_STEPS_LIMIT
    );

    // Determine commands using volume step up/down based on volume steps value
    const commands = [...Array(Math.abs(volumeSteps)).keys()].map(() => {
      const command = property.getCommand(volumeSteps >= 0 ? VolumeStep.UP : VolumeStep.DOWN);
      return openhab.sendCommand(property.item.name, command);
    });

    await Promise.all(commands);

    return directive.response();
  }

  /**
   * Sets step speaker mute
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setMute(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.MUTED
    });

    // Throw invalid value error if no speaker volume property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('No muted property defined.');
    }

    const command = property.getCommand(MuteStep.MUTE);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }
}

module.exports = StepSpeaker;
