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

import AlexaDisplayCategory from '#alexa/smarthome/category.js';
import Fan from './fan.js';

/**
 * Defines air freshener device type class
 * @extends Fan
 */
export default class AirFreshner extends Fan {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['AirFreshener'];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.AIR_FRESHENER];
  }
}
