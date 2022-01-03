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

const AlexaDisplayCategory = require('@alexa/smarthome/category');
const Scene = require('./scene');

/**
 * Defines activity device type class
 * @extends Scene
 */
class Activity extends Scene {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['Activity'];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.ACTIVITY_TRIGGER];
  }
}

module.exports = Activity;
