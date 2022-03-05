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
const ModeControllerHandler = require('../handlers/modeController');
const { Mode } = require('../properties');
const { AlexaModeResources } = require('../resources');
const AlexaSemantics = require('../semantics');
const GenericController = require('./genericController');

/**
 * Defines Alexa.ModeController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-modecontroller.html
 * @extends GenericController
 */
class ModeController extends GenericController {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_MODE_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.MODE]: Mode
    };
  }

  /**
   * Returns capability configuration
   * @return {Object}
   */
  getCapabilityConfiguration() {
    const configuration = {};
    const { supportedModes, ordered, language } = this.getProperty({ name: Property.MODE });

    configuration.ordered = ordered;
    configuration.supportedModes = Object.entries(supportedModes).map(([mode, labels]) => ({
      value: mode,
      modeResources: AlexaModeResources.getResources(labels, language)
    }));

    return configuration;
  }

  /**
   * Returns capability semantics
   * @return {Object}
   */
  getCapabilitySemantics() {
    const semantics = new AlexaSemantics();
    const { actionMappings, stateMappings, supportedModes, ordered } = this.getProperty({ name: Property.MODE });

    // Iterate over action mappings
    for (const [name, value] of Object.entries(actionMappings)) {
      if (/^\(.+\)$/.test(value)) {
        // Define ajust mode directive
        const directive = {
          name: ModeControllerHandler.ADJUST_MODE,
          payload: { modeDelta: parseInt(value.slice(1, -1)) }
        };
        // Add action mapping object if mode delta numerical and ordered property active
        if (!isNaN(directive.payload.modeDelta) && ordered) {
          semantics.addActionToDirective(name, directive);
        }
      } else {
        // Define set mode directive
        const directive = {
          name: ModeControllerHandler.SET_MODE,
          payload: { mode: value }
        };
        // Add action mapping object if mode value supported
        if (supportedModes[value]) {
          semantics.addActionToDirective(name, directive);
        }
      }
    }

    // Iterate over state mappings
    for (const [name, value] of Object.entries(stateMappings)) {
      // Add state mapping object if mode value supported
      if (supportedModes[value]) {
        semantics.addStateToValue(name, value);
      }
    }

    return semantics.toJSON();
  }
}

module.exports = ModeController;
