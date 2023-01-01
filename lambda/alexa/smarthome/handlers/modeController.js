/**
 * Copyright (c) 2010-2023 Contributors to the openHAB project
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

import { Interface, Property } from '../constants.js';
import { OpenState } from '../device/attributes/index.js';
import { InvalidValueError, ValueOutOfRangeError } from '../errors.js';
import AlexaHandler from './handler.js';
import Safety from './safety.js';

/**
 * Defines Alexa.ModeController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-modecontroller.html#directives
 * @extends AlexaHandler
 */
export default class ModeController extends AlexaHandler {
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

    // Throw invalid value error if no mode property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('No mode property defined.');
    }

    // Check safety alerts for open state attribute closed requests
    if (directive.instance === OpenState.name && directive.payload.mode === OpenState.CLOSED) {
      await Safety.checkAlerts(directive, openhab);
    }

    const { item, supportedModes } = property;
    const mode = directive.payload.mode;

    // Throw invalid value error if mode not supported
    if (!Object.keys(supportedModes).includes(mode)) {
      throw new InvalidValueError(`${mode} mode isn't supported.`);
    }

    const command = property.getCommand(mode);

    await openhab.sendCommand(item.name, command);

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

    // Throw invalid value error if no mode property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('No mode property defined.');
    }

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
