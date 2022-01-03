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
 * Defines Alexa.BrightnessController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-brightnesscontroller.html#directives
 * @extends AlexaHandler
 */
class BrightnessController extends AlexaHandler {
  /**
   * Defines set brightness directive
   * @type {String}
   */
  static SET_BRIGHTNESS = 'SetBrightness';

  /**
   * Defines adjust brightness directive
   * @type {String}
   */
  static ADJUST_BRIGHTNESS = 'AdjustBrightness';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_BRIGHTNESS_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [BrightnessController.SET_BRIGHTNESS]: this.setBrightness,
      [BrightnessController.ADJUST_BRIGHTNESS]: this.adjustBrightness
    };
  }

  /**
   * Sets brightness
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setBrightness(directive, openhab) {
    const { item } = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.BRIGHTNESS
    });

    await openhab.sendCommand(item.name, directive.payload.brightness);

    return directive.response();
  }

  /**
   * Adjusts brightness
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustBrightness(directive, openhab) {
    const { item, isRetrievable } = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.BRIGHTNESS
    });

    // Throw invalid value error if property not retrievable
    if (!isRetrievable) {
      throw new InvalidValueError(`Cannot retrieve state for item ${item.name}.`);
    }

    // Get item current state
    let state = await openhab.getItemState(item.name);

    // Extract brightness level for color item type
    if (state && state.split(',').length === 3) {
      state = state.split(',').pop();
    }

    // Throw endpoint unreachable error if state not a number
    if (isNaN(state)) {
      throw new EndpointUnreachableError(`Could not get numeric state for item ${item.name}.`);
    }

    // Determine adjusted brightness adding directive payload delta value to current state
    const brightness = clamp(parseInt(state) + directive.payload.brightnessDelta, 0, 100);

    await openhab.sendCommand(item.name, brightness);

    return directive.response();
  }
}

module.exports = BrightnessController;
