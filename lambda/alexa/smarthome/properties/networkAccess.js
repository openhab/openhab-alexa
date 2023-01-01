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

import BinaryState from './binaryState.js';

/**
 * Defines network access property class
 * @extends BinaryState
 */
export default class NetworkAccess extends BinaryState {
  /**
   * Defines allowed state
   * @type {String}
   */
  static ALLOWED = 'ALLOWED';

  /**
   * Defines blocked state
   * @type {String}
   */
  static BLOCKED = 'BLOCKED';

  /**
   * Returns supported values
   *  https://developer.amazon.com/docs/networking/alexa-networking-accesscontroller.html#properties
   * @return {Array}
   */
  get supportedValues() {
    return [NetworkAccess.ALLOWED, NetworkAccess.BLOCKED];
  }

  /**
   * Returns if supports commands
   * @return {Boolean}
   */
  get supportsCommands() {
    return true;
  }
}
