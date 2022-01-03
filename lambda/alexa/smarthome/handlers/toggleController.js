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
const { InvalidValueError } = require('../errors');
const { ToggleState } = require('../properties');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.ToggleController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-togglecontroller.html#directives
 * @extends AlexaHandler
 */
class ToggleController extends AlexaHandler {
  /**
   * Defines turn on directive
   * @type {String}
   */
  static TURN_ON = 'TurnOn';

  /**
   * Defines turn off directive
   * @type {String}
   */
  static TURN_OFF = 'TurnOff';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_TOGGLE_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [ToggleController.TURN_ON]: this.setToggleState,
      [ToggleController.TURN_OFF]: this.setToggleState
    };
  }

  /**
   * Sets toggle state
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setToggleState(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      instance: directive.instance,
      property: Property.TOGGLE_STATE
    });

    // Throw invalid value error if no toggle state property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('No toggle state property defined.');
    }

    const command = property.getCommand(directive.name === ToggleController.TURN_ON ? ToggleState.ON : ToggleState.OFF);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }
}

module.exports = ToggleController;
