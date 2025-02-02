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
import Temperature from './temperature.js';

/**
 * Defines heating setpoint attribute class
 * @extends Temperature
 */
export default class HeatingSetpoint extends Temperature {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return [
      'HeatingSetpoint',
      'LowerTemperature' // For backward compatibility (deprecated)
    ];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @return {Array}
   */
  static getCapabilities(item, metadata) {
    return [
      {
        name: Capability.THERMOSTAT_CONTROLLER,
        property: Property.LOWER_SETPOINT,
        tag: this.tag,
        parameters: {
          scale: this.getV2TemperatureScale(metadata)
        }
      }
    ];
  }
}
