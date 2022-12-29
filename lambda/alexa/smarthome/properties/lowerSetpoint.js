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

import { Property } from '../constants.js';
import { Parameter, ParameterType } from '../metadata.js';
import AlexaUnitOfMeasure from '../unitOfMeasure.js';
import TargetSetpoint from './targetSetpoint.js';
import ThermostatMode from './thermostatMode.js';

/**
 * Defines lower setpoint property class
 * @extends TargetSetpoint
 */
export default class LowerSetpoint extends TargetSetpoint {
  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      ...super.supportedParameters,
      [Parameter.COMFORT_RANGE]: ParameterType.FLOAT
    };
  }

  /**
   * Returns supported tags
   * @return {Array}
   */
  get supportedTags() {
    return [ThermostatMode.ECO.toLowerCase()];
  }

  /**
   * Returns required linked properties
   * @return {Array}
   */
  get requiredLinkedProperties() {
    return [{ name: Property.UPPER_SETPOINT, tag: this.tag }];
  }

  /**
   * Returns default comfort range value based on scale parameter
   * @return {Number}
   */
  get defaultComfortRange() {
    return this.scale === AlexaUnitOfMeasure.UNIT_FAHRENHEIT ? 2 : 1;
  }

  /**
   * Returns comfort range based on parameter
   * @return {Number}
   */
  get comfortRange() {
    return this.parameters[Parameter.COMFORT_RANGE] || this.defaultComfortRange;
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

    const range = parameters[Parameter.COMFORT_RANGE];
    // Define max comfort range using setpoint range
    const maxRange = (this.setpointRange[1] - this.setpointRange[0]) / 2;
    // Update comfort range parameter if valid (range < max), otherwise set to undefined
    parameters[Parameter.COMFORT_RANGE] = range < maxRange ? range : undefined;
  }
}
