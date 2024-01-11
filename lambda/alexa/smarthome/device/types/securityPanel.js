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
import DeviceType from './type.js';
import {
  ArmState,
  BurglaryAlarm,
  CarbonMonoxideAlarm,
  FireAlarm,
  WaterAlarm,
  AlarmAlert,
  ReadyAlert,
  TroubleAlert,
  ZonesAlert,
  genericAttributes
} from '../attributes/index.js';

/**
 * Defines security panel device type class
 * @extends DeviceType
 */
export default class SecurityPanel extends DeviceType {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['SecurityPanel'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [
      ArmState,
      BurglaryAlarm,
      CarbonMonoxideAlarm,
      FireAlarm,
      WaterAlarm,
      AlarmAlert,
      ReadyAlert,
      TroubleAlert,
      ZonesAlert,
      ...genericAttributes
    ];
  }

  /**
   * Returns default attributes
   * @return {Array}
   */
  static get defaultAttributes() {
    return [ArmState];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.SECURITY_PANEL];
  }
}
