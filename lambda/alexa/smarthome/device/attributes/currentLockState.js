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

import { DecoupleState } from '#alexa/smarthome/properties/index.js';
import LockState from './lockState.js';

/**
 * Defines current lock state attribute class
 * @extends LockState
 */
export default class CurrentLockState extends LockState {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['CurrentLockState'];
  }

  /**
   * Returns tag
   * @type {String}
   */
  static get tag() {
    return DecoupleState.TAG_SENSOR;
  }
}
