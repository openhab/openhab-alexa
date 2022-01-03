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
const { MotionDetectionState } = require('../attributes');

/**
 * Defines motion sensor device type class
 * @extends Sensor
 */
class MotionSensor extends Sensor {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['MotionSensor'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [MotionDetectionState, ...super.supportedAttributes];
  }

  /**
   * Returns default attributes
   * @return {Array}
   */
  static get defaultAttributes() {
    return [MotionDetectionState];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.MOTION_SENSOR];
  }
}

module.exports = MotionSensor;
