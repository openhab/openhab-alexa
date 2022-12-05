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

import AlexaCapability from './capability.js';
import AlexaDisplayCategory from '../category.js';
import { Capability, Interface, Property } from '../constants.js';
import { EqualizerBands, EqualizerMode } from '../properties/index.js';

/**
 * Defines Alexa.EqualizerController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-equalizercontroller.html
 * @extends AlexaCapability
 */
export default class EqualizerController extends AlexaCapability {
  /**
   * Returns name
   * @return {String}
   */
  static get name() {
    return Capability.EQUALIZER_CONTROLLER;
  }

  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_EQUALIZER_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.EQUALIZER_BANDS]: EqualizerBands,
      [Property.EQUALIZER_MODE]: EqualizerMode
    };
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return [AlexaDisplayCategory.SPEAKER];
  }

  /**
   * Returns capability interface
   * @return {Object}
   */
  getCapabilityInterface() {
    // Get capability interface from parent method
    const capability = super.getCapabilityInterface();

    // Initialize capability configurations object
    capability.configurations = {};

    // Iterate over properties
    for (const property of this.properties) {
      const { component, range, supportedModes } = property;

      if (property instanceof EqualizerBands) {
        capability.configurations.bands = capability.configurations.bands || { supported: [] };
        capability.configurations.bands.supported.push({ name: component.toUpperCase() });
        capability.configurations.bands.range = { minimum: range[0], maximum: range[1] };
      } else {
        capability.configurations.modes = { supported: supportedModes.map((mode) => ({ name: mode })) };
      }
    }

    return capability;
  }
}
