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
import Entertainment from './entertainment.js';
import { VolumeLevel, PowerState } from '../attributes/index.js';

/**
 * Defines speaker device type class
 * @extends Entertainment
 */
export default class Speaker extends Entertainment {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['Speaker'];
  }

  /**
   * Returns default attributes
   * @return {Array}
   */
  static get defaultAttributes() {
    return [PowerState, VolumeLevel];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.SPEAKER];
  }
}
