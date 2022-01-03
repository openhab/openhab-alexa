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

const DeviceType = require('./type');
const { BatteryLevel, genericAttributes } = require('../attributes');

/**
 * Defines sensor device type class
 * @extends DeviceType
 */
class Sensor extends DeviceType {
  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [BatteryLevel, ...genericAttributes];
  }
}

module.exports = Sensor;
