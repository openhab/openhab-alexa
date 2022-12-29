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
import { Capability, Interface, Property } from '../constants.js';
import { OpenState } from '../device/attributes/index.js';
import { AlertState } from '../properties/index.js';

/**
 * Defines Alexa.Safety interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-safety-errorresponse.html
 * @extends AlexaCapability
 */
export default class Safety extends AlexaCapability {
  /**
   * Returns name
   * @return {String}
   */
  static get name() {
    return Capability.SAFETY;
  }

  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_SAFETY;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.OBSTACLE_ALERT]: AlertState
    };
  }

  /**
   * Returns required linked capabilities
   * @return {Array}
   */
  get requiredLinkedCapabilities() {
    // Requires open state attribute mode controller capability to be linked
    return [{ name: Capability.MODE_CONTROLLER, instance: OpenState.name }];
  }

  /**
   * Returns if is discoverable
   * @return {Boolean}
   */
  get isDiscoverable() {
    return false;
  }
}
