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
import Sensor from './sensor.js';
import { ContactDetectionState } from '../attributes/index.js';

/**
 * Defines contact sensor device type class
 * @extends Sensor
 */
export default class ContactSensor extends Sensor {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['ContactSensor'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [ContactDetectionState, ...super.supportedAttributes];
  }

  /**
   * Returns default attributes
   * @return {Array}
   */
  static get defaultAttributes() {
    return [ContactDetectionState];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.CONTACT_SENSOR];
  }
}
