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

const { Interface, Property } = require('../constants');
const { OpenState } = require('../device/attributes');
const { InvalidValueError, ValueOutOfRangeError } = require('../errors');
const AlexaHandler = require('./handler');
const Safety = require('./safety');

/**
 * Defines Alexa.ModeController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-modecontroller.html#directives
 * @extends AlexaHandler
 */
class ModeController extends AlexaHandler {
  /**
   * Defines set mode directive
   * @type {String}
   */
  static SET_MODE = 'SetMode';

  /**
   * Defines adjust mode action
   * @type {String}
   */
  static ADJUST_MODE = 'AdjustMode';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_MODE_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [ModeController.SET_MODE]: this.setMode,
      [ModeController.ADJUST_MODE]: this.adjustMode
    };
  }

  /**
   * Sets mode
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setMode(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      instance: directive.instance,
      property: Property.MODE
    });

    // Check safety alerts for open state attribute closed requests
    if (directive.instance === OpenState.name && directive.payload.mode === OpenState.CLOSED) {
      await Safety.checkAlerts(directive, openhab);
    }

    const command = property.getCommand(directive.payload.mode);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }

  /**
   * Adjusts mode
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustMode(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      instance: directive.instance,
      property: Property.MODE
    });
    const { item, supportedModes, isRetrievable } = property;

    // Throw invalid value error if property not retrievable
    if (!isRetrievable) {
      throw new InvalidValueError(`Cannot retrieve state for item ${item.name}.`);
    }

    // Get item current state
    const state = await openhab.getItemState(item.name);
    // Define adjustable modes using supported modes keys
    const modes = Object.keys(supportedModes);
    // Find current mode index
    const index = modes.indexOf(state);

    // Throw invalid value error if current mode not found
    if (index === -1) {
      throw new InvalidValueError(`Current mode ${state} not found in supported list.`);
    }

    // Determine adjusted mode
    const mode = modes[index + directive.payload.modeDelta];

    // Throw value out of range error if adjusted mode not defined
    if (typeof mode === 'undefined') {
      throw new ValueOutOfRangeError(`Adjusted mode value is out of range.`);
    }

    const command = property.getCommand(mode);

    await openhab.sendCommand(item.name, command);

    return directive.response();
  }
}

module.exports = ModeController;
