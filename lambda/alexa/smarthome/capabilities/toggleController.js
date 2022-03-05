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

const { ItemValue } = require('@openhab/constants');
const { Interface, Property } = require('../constants');
const ToggleControllerHandler = require('../handlers/toggleController');
const { ToggleState } = require('../properties');
const AlexaSemantics = require('../semantics');
const GenericController = require('./genericController');

/**
 * Defines Alexa.ToggleController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-togglecontroller.html
 * @extends GenericController
 */
class ToggleController extends GenericController {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_TOGGLE_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.TOGGLE_STATE]: ToggleState
    };
  }

  /**
   * Returns capability semantics
   * @return {Object}
   */
  getCapabilitySemantics() {
    const semantics = new AlexaSemantics();
    const { actionMappings, stateMappings } = this.getProperty({ name: Property.TOGGLE_STATE });

    // Iterate over action mappings
    for (const [name, value] of Object.entries(actionMappings)) {
      // Add action mapping object if toggle value valid
      if (value === ItemValue.ON || value === ItemValue.OFF) {
        semantics.addActionToDirective(name, {
          name: value === ItemValue.ON ? ToggleControllerHandler.TURN_ON : ToggleControllerHandler.TURN_OFF,
          payload: {}
        });
      }
    }

    // Iterate over state mappings
    for (const [name, value] of Object.entries(stateMappings)) {
      // Add state mapping object if toggle value valid
      if (value === ItemValue.ON || value === ItemValue.OFF) {
        semantics.addStateToValue(name, value);
      }
    }

    return semantics.toJSON();
  }
}

module.exports = ToggleController;
