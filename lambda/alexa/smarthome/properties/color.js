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

import { ItemType } from '#openhab/constants.js';
import AlexaProperty from './property.js';

/**
 * Defines color property class
 * @extends AlexaProperty
 */
export default class Color extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.COLOR];
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Object}
   */
  getState(value) {
    const [hue, saturation, brightness] =
      typeof value === 'string' ? value.split(',').map((value) => parseFloat(value)) : [];

    // Return formatted hsb state if valid
    if (!isNaN(hue) && !isNaN(saturation) && !isNaN(brightness)) {
      return { hue, saturation: saturation / 100, brightness: brightness / 100 };
    }
  }
}
