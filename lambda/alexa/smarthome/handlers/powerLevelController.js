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
 * Defines Alexa.PowerLevelController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-powerlevelcontroller.html#directives
 * @extends AlexaHandler
 */
class PowerLevelController extends AlexaHandler {
  /**
   * Defines set power level directive
   * @type {String}
   */
  static SET_POWER_LEVEL = 'SetPowerLevel';

  /**
   * Defines adjust power level directive
   * @type {String}
   */
  static ADJUST_POWER_LEVEL = 'AdjustPowerLevel';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_POWER_LEVEL_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [PowerLevelController.SET_POWER_LEVEL]: this.setPowerLevel,
      [PowerLevelController.ADJUST_POWER_LEVEL]: this.adjustPowerLevel
    };
  }

  /**
   * Sets power level
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setPowerLevel(directive, openhab) {
    const { item } = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.POWER_LEVEL
    });

    await openhab.sendCommand(item.name, directive.payload.powerLevel);

    return directive.response();
  }

  /**
   * Adjusts power level
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustPowerLevel(directive, openhab) {
    const { item, isRetrievable } = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.POWER_LEVEL
    });

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

    // Determine adjusted power level adding directive payload delta value to current state
    const powerLevel = clamp(parseInt(state) + directive.payload.powerLevelDelta, 0, 100);

    await openhab.sendCommand(item.name, powerLevel);

    return directive.response();
  }
}

module.exports = PowerLevelController;
