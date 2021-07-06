/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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

const { ItemType } = require('@openhab/constants');
const VolumeLevel = require('./volumeLevel');

/**
 * Defines volume steps property class
 * @extends VolumeLevel
 */
class VolumeSteps extends VolumeLevel {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.NUMBER];
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }
}

module.exports = VolumeSteps;
