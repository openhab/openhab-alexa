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

import { ThermostatMode } from '#alexa/smarthome/properties/index.js';
import HeatingSetpoint from './heatingSetpoint.js';

/**
 * Defines eco heating setpoint attribute class
 * @extends HeatingSetpoint
 */
export default class EcoHeatingSetpoint extends HeatingSetpoint {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['EcoHeatingSetpoint'];
  }

  /**
   * Returns tag
   * @return {String}
   */
  static get tag() {
    return ThermostatMode.ECO.toLowerCase();
  }
}
