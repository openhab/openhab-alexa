/**
 * Copyright (c) 2010-2025 Contributors to the openHAB project
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

import { Capability, Property } from '#alexa/smarthome/constants.js';
import DeviceAttribute from './attribute.js';

/**
 * Defines power level attribute class
 * @extends DeviceAttribute
 */
export default class PowerLevel extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['PowerLevel'];
  }

  /**
   * Returns capabilities
   * @return {Array}
   */
  static getCapabilities() {
    return [{ name: Capability.POWER_LEVEL_CONTROLLER, property: Property.POWER_LEVEL }];
  }
}
