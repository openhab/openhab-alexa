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

import AlexaDisplayCategory from '#alexa/smarthome/category.js';
import Fan from './fan.js';
import { TargetTemperature, Temperature, PowerState } from '../attributes/index.js';

/**
 * Defines air conditioner device type class
 * @extends Fan
 */
export default class AirConditioner extends Fan {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['AirConditioner'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [TargetTemperature, Temperature, ...super.supportedAttributes];
  }

  /**
   * Returns default attributes
   * @return {Array}
   */
  static get defaultAttributes() {
    return [PowerState];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.AIR_CONDITIONER];
  }
}
