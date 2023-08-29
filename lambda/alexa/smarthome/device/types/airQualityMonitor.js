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

import AlexaDisplayCategory from '#alexa/smarthome/category.js';
import Sensor from './sensor.js';
import { Temperature, Humidity } from '../attributes/index.js';

/**
 * Defines air quality monitor device type class
 * @extends Sensor
 */
export default class AirQualityMonitor extends Sensor {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['AirQualityMonitor'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [Temperature, Humidity, ...super.supportedAttributes];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.AIR_QUALITY_MONITOR];
  }
}
