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

const AlexaCapability = require('./capability');
const AlexaDisplayCategory = require('../category');
const { Interface, Property } = require('../constants');
const { Keystroke } = require('../properties');

/**
 * Defines Alexa.KeypadController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-keypadcontroller.html
 * @extends AlexaCapability
 */
class KeypadController extends AlexaCapability {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_KEYPAD_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.KEYSTROKE]: Keystroke
    };
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return [AlexaDisplayCategory.STREAMING_DEVICE];
  }

  /**
   * Returns alexa interface
   * @return {Object}
   */
  getAlexaInterface() {
    // Get capability interface from parent method
    const capability = super.getAlexaInterface();
    const { supportedKeys } = this.getProperty({ name: Property.KEYSTROKE });

    capability.keys = supportedKeys;

    return capability;
  }
}

module.exports = KeypadController;
