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

import { ItemType } from '#openhab/constants.js';
import AlexaProperty from './property.js';

/**
 * Defines brightness property class
 * @extends AlexaProperty
 */
export default class Brightness extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.COLOR, ItemType.DIMMER];
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Number}
   */
  getState(value) {
    // Extract brightness level for color item type
    if (typeof value === 'string' && value.split(',').length === 3) {
      value = value.split(',').pop();
    }

    // Return state if numerical value
    if (!isNaN(value)) {
      return parseInt(value);
    }
  }
}
