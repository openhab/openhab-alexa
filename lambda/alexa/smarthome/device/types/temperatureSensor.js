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
const Sensor = require('./sensor');
const { Temperature } = require('../attributes');

/**
 * Defines temperature sensor device type class
 * @extends Sensor
 */
class TemperatureSensor extends Sensor {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['TemperatureSensor'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [Temperature, ...super.supportedAttributes];
  }

  /**
   * Returns default attributes
   * @return {Array}
   */
  static get defaultAttributes() {
    return [Temperature];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.TEMPERATURE_SENSOR];
  }
}

module.exports = TemperatureSensor;
