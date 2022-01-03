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

const BinaryState = require('./binaryState');

/**
 * Defines alert state property class
 * @extends BinaryState
 */
class AlertState extends BinaryState {
  /**
   * Defines alert state
   * @type {String}
   */
  static ALERT = 'ALERT';

  /**
   * Defines ok state
   * @type {String}
   */
  static OK = 'OK';

  /**
   * Returns supported values
   * @return {Array}
   */
  get supportedValues() {
    return [AlertState.ALERT, AlertState.OK];
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }
}

module.exports = AlertState;
