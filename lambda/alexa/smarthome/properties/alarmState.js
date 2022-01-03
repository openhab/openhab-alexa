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
 * Defines alarm state property class
 * @extends BinaryState
 */
class AlarmState extends BinaryState {
  /**
   * Defines alarm state
   * @type {String}
   */
  static ALARM = 'ALARM';

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
    return [AlarmState.ALARM, AlarmState.OK];
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Object}
   */
  getState(value) {
    // Get state map value from parent method
    value = super.getState(value);

    // Return formatted state if defined
    if (typeof value !== 'undefined') {
      return { value };
    }
  }
}

module.exports = AlarmState;
