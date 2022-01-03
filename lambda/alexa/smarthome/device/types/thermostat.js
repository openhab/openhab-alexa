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

const AlexaDisplayCategory = require('@alexa/smarthome/category');
const { Parameter } = require('@alexa/smarthome/metadata');
const DeviceType = require('./type');
const {
  HeatingCoolingMode,
  TargetTemperature,
  CoolingSetpoint,
  HeatingSetpoint,
  EcoCoolingSetpoint,
  EcoHeatingSetpoint,
  ThermostatHold,
  ThermostatFan,
  Temperature,
  Humidity,
  BatteryLevel,
  genericAttributes
} = require('../attributes');

/**
 * Defines thermostat device type class
 * @extends DeviceType
 */
class Thermostat extends DeviceType {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['Thermostat'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [
      HeatingCoolingMode,
      TargetTemperature,
      CoolingSetpoint,
      HeatingSetpoint,
      EcoCoolingSetpoint,
      EcoHeatingSetpoint,
      ThermostatHold,
      ThermostatFan,
      Temperature,
      Humidity,
      BatteryLevel,
      ...genericAttributes
    ];
  }

  /**
   * Returns default attributes
   * @return {Array}
   */
  static get defaultAttributes() {
    return [HeatingCoolingMode];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.THERMOSTAT];
  }

  /**
   * Returns config
   * @param  {Object} metadata
   * @return {Object}
   */
  static getConfig(metadata) {
    // Add v2 temperature scale parameter if scale config not defined
    if (!metadata.getConfigParameter(Parameter.SCALE)) {
      metadata.setConfigParameter(Parameter.SCALE, Temperature.getV2TemperatureScale(metadata));
    }

    return super.getConfig(metadata);
  }
}

module.exports = Thermostat;
