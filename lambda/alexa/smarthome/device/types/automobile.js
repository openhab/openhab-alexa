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
const DeviceType = require('./type');
const {
  BatteryLevel,
  FanSpeed,
  LockState,
  PowerState,
  TargetTemperature,
  Temperature,
  genericAttributes
} = require('../attributes');

/**
 * Defines automobile device type class
 * @extends DeviceType
 */
class Automobile extends DeviceType {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['Automobile'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [BatteryLevel, FanSpeed, LockState, PowerState, TargetTemperature, Temperature, ...genericAttributes];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.VEHICLE];
  }
}

module.exports = Automobile;
