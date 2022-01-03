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
const { PowerState } = require('../properties');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.PowerController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-powercontroller.html#directives
 * @extends AlexaHandler
 */
class PowerController extends AlexaHandler {
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
    return Interface.ALEXA_POWER_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [PowerController.TURN_ON]: this.setPowerState,
      [PowerController.TURN_OFF]: this.setPowerState
    };
  }

  /**
   * Turns power state ON or OFF
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setPowerState(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.POWER_STATE
    });

    // Throw invalid value error if no power state property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('No power state property defined.');
    }

    const command = property.getCommand(directive.name === PowerController.TURN_ON ? PowerState.ON : PowerState.OFF);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }
}

module.exports = PowerController;
