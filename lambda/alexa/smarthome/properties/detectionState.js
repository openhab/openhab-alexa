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
 * Defines detection state property class
 * @extends BinaryState
 */
class DetectionState extends BinaryState {
  /**
   * Defines detected state
   * @type {String}
   */
  static DETECTED = 'DETECTED';

  /**
   * Defines not detected state
   * @type {String}
   */
  static NOT_DETECTED = 'NOT_DETECTED';

  /**
   * Returns supported values
   * @return {Array}
   */
  get supportedValues() {
    return [DetectionState.DETECTED, DetectionState.NOT_DETECTED];
  }
}

module.exports = DetectionState;
