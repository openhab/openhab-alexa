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
const RangeControllerHandler = require('../handlers/rangeController');
const { RangeValue } = require('../properties');
const { AlexaPresetResources } = require('../resources');
const AlexaSemantics = require('../semantics');
const GenericController = require('./genericController');

/**
 * Defines Alexa.RangeController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-rangecontroller.html
 * @extends GenericController
 */
class RangeController extends GenericController {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_RANGE_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.RANGE_VALUE]: RangeValue
    };
  }

  /**
   * Returns capability configuration
   * @return {Object}
   */
  getCapabilityConfiguration() {
    const configuration = {};
    const { supportedRange, presets, unitOfMeasure, language } = this.getProperty({ name: Property.RANGE_VALUE });

    configuration.supportedRange = {
      minimumValue: supportedRange[0],
      maximumValue: supportedRange[1],
      precision: Math.abs(supportedRange[2])
    };

    if (unitOfMeasure) {
      configuration.unitOfMeasure = 'Alexa.Unit.' + unitOfMeasure;
    }

    if (presets) {
      configuration.presets = Object.entries(presets).map(([preset, labels]) => ({
        rangeValue: parseFloat(preset),
        presetResources: AlexaPresetResources.getResources(labels, language)
      }));
    }

    return configuration;
  }

  /**
   * Returns capability semantics
   * @return {Object}
   */
  getCapabilitySemantics() {
    const semantics = new AlexaSemantics();
    const { actionMappings, stateMappings, supportedRange } = this.getProperty({ name: Property.RANGE_VALUE });

    // Iterate over action mappings
    for (const [name, value] of Object.entries(actionMappings)) {
      if (/^\(.+\)$/.test(value)) {
        // Define ajust range directive
        const directive = {
          name: RangeControllerHandler.ADJUST_RANGE_VALUE,
          payload: { rangeValueDelta: parseFloat(value.slice(1, -1)), rangeValueDeltaDefault: false }
        };
        // Add action mapping object if absolute range delta < max range
        if (Math.abs(directive.payload.rangeValueDelta) < supportedRange[1] - supportedRange[0]) {
          semantics.addActionToDirective(name, directive);
        }
      } else {
        // Define set range directive
        const directive = {
          name: RangeControllerHandler.SET_RANGE_VALUE,
          payload: { rangeValue: parseFloat(value) }
        };
        // Add action mapping object if range value valid
        if (value >= supportedRange[0] && value <= supportedRange[1]) {
          semantics.addActionToDirective(name, directive);
        }
      }
    }

    // Iterate over state mappings
    for (const [name, value] of Object.entries(stateMappings)) {
      const values = value && value.split(':', 2);
      // Add state mapping object if value(s) valid
      if (values && values.every((value) => value >= supportedRange[0] && value <= supportedRange[1])) {
        if (values.length === 1) {
          semantics.addStateToValue(name, parseFloat(values[0]));
        } else if (values[0] < values[1]) {
          semantics.addStateToRange(name, { minimumValue: parseFloat(values[0]), maximumValue: parseFloat(values[1]) });
        }
      }
    }

    return semantics.toJSON();
  }
}

module.exports = RangeController;
