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

/**
 * Defines Alexa.KeypadController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-keypadcontroller.html#directives
 * @extends AlexaHandler
 */
class KeypadController extends AlexaHandler {
  /**
   * Defines send keystroke directive
   * @type {String}
   */
  static SEND_KEYSTROKE = 'SendKeystroke';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_KEYPAD_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [KeypadController.SEND_KEYSTROKE]: this.sendKeystroke
    };
  }

  /**
   * Sends keystroke
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async sendKeystroke(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.KEYSTROKE
    });
    const { item, supportedKeys } = property;
    const keystroke = directive.payload.keystroke;

    // Throw invalid value error if requested keystroke not supported
    if (!supportedKeys.includes(keystroke)) {
      throw new InvalidValueError(`${item.name} doesn't support keystroke [${keystroke}]`);
    }

    const command = property.getCommand(keystroke);

    await openhab.sendCommand(item.name, command);

    return directive.response();
  }
}

module.exports = KeypadController;
