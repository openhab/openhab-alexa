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
const Door = require('./door');
const { PositionState, TiltAngle } = require('../attributes');

/**
 * Defines interior blind device type class
 * @extends Door
 */
class InteriorBlind extends Door {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['Blind', 'Curtain', 'Shade', 'InteriorBlind'];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [PositionState, TiltAngle, ...super.supportedAttributes];
  }

  /**
   * Returns default attributes
   * @return {Array}
   */
  static get defaultAttributes() {
    return [PositionState, ...super.defaultAttributes];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.INTERIOR_BLIND];
  }
}

module.exports = InteriorBlind;
