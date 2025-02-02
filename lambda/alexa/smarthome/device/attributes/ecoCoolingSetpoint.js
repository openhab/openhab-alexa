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

import { ThermostatMode } from '#alexa/smarthome/properties/index.js';
import CoolingSetpoint from './coolingSetpoint.js';

/**
 * Defines eco cooling setpoint attribute class
 * @extends CoolingSetpoint
 */
export default class EcoCoolingSetpoint extends CoolingSetpoint {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['EcoCoolingSetpoint'];
  }

  /**
   * Returns tag
   * @return {String}
   */
  static get tag() {
    return ThermostatMode.ECO.toLowerCase();
  }
}
