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
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.InputController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-inputcontroller.html#directives
 * @extends AlexaHandler
 */
class InputController extends AlexaHandler {
  /**
   * Defines select input directive
   * @type {String}
   */
  static SELECT_INPUT = 'SelectInput';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_INPUT_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [InputController.SELECT_INPUT]: this.selectInput
    };
  }

  /**
   * Selects input
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async selectInput(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.INPUT
    });
    const { item, supportedInputs } = property;
    const input = directive.payload.input;

    // Throw invalid value error if requested input not supported
    if (!supportedInputs.find((value) => value.replace(/\s/g, '') === input.replace(/\s/g, ''))) {
      throw new InvalidValueError(`${item.name} doesn't support input [${input}]`);
    }

    const command = property.getCommand(input);

    await openhab.sendCommand(item.name, command);

    return directive.response();
  }
}

module.exports = InputController;
