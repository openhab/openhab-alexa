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

const { Parameter, ParameterType } = require('../metadata');
const AlexaUnitOfMeasure = require('../unitOfMeasure');
const Temperature = require('./temperature');

/**
 * Defines target setpoint property class
 * @extends Temperature
 */
class TargetSetpoint extends Temperature {
  /**
   * Defines default setpoint range in celsius
   * @type {Array}
   */
  static DEFAULT_RANGE_CELSIUS = [4, 32];

  /**
   * Defines default setpoint range in fahrenheit
   * @type {Array}
   */
  static DEFAULT_RANGE_FAHRENHEIT = [40, 90];

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      ...super.supportedParameters,
      [Parameter.SETPOINT_RANGE]: ParameterType.RANGE
    };
  }

  /**
   * Returns default setpoint range based on scale parameter
   * @return {Array}
   */
  get defaultSetpointRange() {
    return this.scale === AlexaUnitOfMeasure.UNIT_FAHRENHEIT
      ? TargetSetpoint.DEFAULT_RANGE_FAHRENHEIT
      : TargetSetpoint.DEFAULT_RANGE_CELSIUS;
  }

  /**
   * Returns setpoint range based on parameter
   * @return {Array}
   */
  get setpointRange() {
    return this.parameters[Parameter.SETPOINT_RANGE] || this.defaultSetpointRange;
  }

  /**
   * Updates parameters
   * @param {Object} item
   * @param {Object} metadata
   * @param {Object} settings
   */
  updateParameters(item, metadata, settings) {
    const parameters = this.parameters;
    // Update parameters from parent method
    super.updateParameters(item, metadata, settings);

    const range = parameters[Parameter.SETPOINT_RANGE] || [];
    // Update setpoint range parameter if valid (min < max), otherwise set to undefined
    parameters[Parameter.SETPOINT_RANGE] = range[0] < range[1] ? range : undefined;
  }
}

module.exports = TargetSetpoint;
