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
import { Input } from '../properties/index.js';

/**
 * Defines Alexa.InputController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-inputcontroller.html
 * @extends AlexaCapability
 */
export default class InputController extends AlexaCapability {
  /**
   * Returns name
   * @return {String}
   */
  static get name() {
    return Capability.INPUT_CONTROLLER;
  }

  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_INPUT_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.INPUT]: Input
    };
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return [AlexaDisplayCategory.TV];
  }

  /**
   * Returns capability interface
   * @return {Object}
   */
  getCapabilityInterface() {
    // Get capability interface from parent method
    const capability = super.getCapabilityInterface();
    const { supportedInputs } = this.getProperty({ name: Property.INPUT });

    capability.inputs = supportedInputs.map((input) => ({ name: input }));

    return capability;
  }
}
