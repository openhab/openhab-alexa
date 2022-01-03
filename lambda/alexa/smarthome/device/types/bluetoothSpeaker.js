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
const Speaker = require('./speaker');
const { BatteryLevel } = require('../attributes');

/**
 * Defines bluetooth speaker device type class
 * @extends Speaker
 */
class BluetoothSpeaker extends Speaker {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['BluetoothSpeaker'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [BatteryLevel, ...super.supportedAttributes];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.BLUETOOTH_SPEAKER];
  }
}

module.exports = BluetoothSpeaker;
