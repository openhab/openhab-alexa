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

const DecoupleState = require('@alexa/smarthome/properties/decoupleState');
const OpenState = require('./openState');

/**
 * Defines current open state attribute class
 * @extends OpenState
 */
class CurrentOpenState extends OpenState {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['CurrentOpenState'];
  }

  /**
   * Returns tag
   * @type {String}
   */
  static get tag() {
    return DecoupleState.TAG_NAME;
  }
}

module.exports = CurrentOpenState;
