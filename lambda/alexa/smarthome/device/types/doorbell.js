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

const AlexaDisplayCategory = require('@alexa/smarthome/category');
const Camera = require('./camera');

/**
 * Defines doorbell device type class
 * @extends Camera
 */
class Doorbell extends Camera {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['Doorbell'];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.DOORBELL];
  }
}

module.exports = Doorbell;
