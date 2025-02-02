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
 * Defines volume step property class
 * @extends AlexaProperty
 */
export default class VolumeStep extends AlexaProperty {
  /**
   * Defines volume step up
   * @type {String}
   */
  static UP = 'VOLUME_UP';

  /**
   * Defines volume step down
   * @type {String}
   */
  static DOWN = 'VOLUME_DOWN';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.STRING];
  }

  /**
   * Returns supported values
   * @return {Array}
   */
  get supportedValues() {
    return [VolumeStep.UP, VolumeStep.DOWN];
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.hasSupportedValuesMapped;
  }
}
