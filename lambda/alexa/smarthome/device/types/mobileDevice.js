/**
 * Copyright (c) 2010-2024 Contributors to the openHAB project
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

import NetworkDevice from './networkDevice.js';
import { BatteryLevel } from '../attributes/index.js';

/**
 * Defines mobile device type class
 * @extends NetworkDevice
 */
export default class MobileDevice extends NetworkDevice {
  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [BatteryLevel, ...super.supportedAttributes];
  }
}
