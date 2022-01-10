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
const { EndpointUnreachableError, InvalidValueError } = require('../errors');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.Speaker interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-speaker.html#directives
 * @extends AlexaHandler
 */
class Speaker extends AlexaHandler {
  /**
   * Defines set volume directive
   * @type {String}
   */
  static SET_VOLUME = 'SetVolume';

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
    return Interface.ALEXA_SPEAKER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [Speaker.SET_VOLUME]: this.setVolume,
      [Speaker.ADJUST_VOLUME]: this.adjustVolume,
      [Speaker.SET_MUTE]: this.setMute
    };
  }

  /**
   * Sets speaker volume
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setVolume(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.VOLUME
    });

    // Throw invalid value error if no speaker volume property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('No volume property defined.');
    }

    await openhab.sendCommand(property.item.name, directive.payload.volume);

    return directive.response();
  }

  /**
   * Adjusts speaker volume
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

    const { item, increment, isRetrievable } = property;

    // Throw invalid value error if property not retrievable
    if (!isRetrievable) {
      throw new InvalidValueError(`Cannot retrieve state for item ${item.name}.`);
    }

    // Get item current state
    const state = await openhab.getItemState(item.name);

    // Throw endpoint unreachable error if state not a number
    if (isNaN(state)) {
      throw new EndpointUnreachableError(`Could not get numeric state for item ${item.name}.`);
    }

    // Define adjusted volume using either volume default and increment parameter, if defined, otherwise volume value
    const volumeAdjust = directive.payload.volume;
    const volumeDefault = directive.payload.volumeDefault;
    const volume = clamp(
      parseInt(state) + (volumeDefault && increment > 0 ? (volumeAdjust >= 0 ? 1 : -1) * increment : volumeAdjust),
      0,
      100
    );

    await openhab.sendCommand(item.name, volume);

    return directive.response();
  }

  /**
   * Sets speaker mute
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

    const command = property.getCommand(directive.payload.mute);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }
}

module.exports = Speaker;
