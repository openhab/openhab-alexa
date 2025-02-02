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

import AlexaDisplayCategory from '#alexa/smarthome/category.js';
import { Parameter } from '#alexa/smarthome/constants.js';
import DeviceType from './type.js';
import {
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
} from '../attributes/index.js';

/**
 * Defines thermostat device type class
 * @extends DeviceType
 */
export default class Thermostat extends DeviceType {
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
