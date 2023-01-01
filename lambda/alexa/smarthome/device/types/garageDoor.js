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
import Door from './door.js';
import { ObstacleAlert } from '../attributes/index.js';

/**
 * Defines garage door device type class
 * @extends Door
 */
export default class GarageDoor extends Door {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['GarageDoor'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [ObstacleAlert, ...super.supportedAttributes];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.GARAGE_DOOR];
  }
}
