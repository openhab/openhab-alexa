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

const ThermostatMode = require('@alexa/smarthome/properties/thermostatMode');
const HeatingSetpoint = require('./heatingSetpoint');

/**
 * Defines eco heating setpoint attribute class
 * @extends HeatingSetpoint
 */
class EcoHeatingSetpoint extends HeatingSetpoint {
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

module.exports = EcoHeatingSetpoint;
