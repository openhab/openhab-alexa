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
import BluetoothSpeaker from './bluetoothSpeaker.js';

/**
 * Defines headphones device type class
 * @extends BluetoothSpeaker
 */
export default class Headphones extends BluetoothSpeaker {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['Headphones'];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.HEADPHONES];
  }
}
