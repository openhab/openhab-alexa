/**
 * Copyright (c) 2010-2023 Contributors to the openHAB project
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
 * Defines cooling setpoint attribute class
 * @extends Temperature
 */
export default class CoolingSetpoint extends Temperature {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return [
      'CoolingSetpoint',
      'UpperTemperature' // For backward compatibility (deprecated)
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
        property: Property.UPPER_SETPOINT,
        tag: this.tag,
        parameters: {
          scale: this.getV2TemperatureScale(metadata)
        }
      }
    ];
  }
}
