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

import { Property } from '../constants.js';
import AlertState from './alertState.js';

/**
 * Defines security alert property class
 * @extends AlertState
 */
export default class SecurityAlert extends AlertState {
  /**
   * Returns required linked properties
   * @return {Array}
   */
  get requiredLinkedProperties() {
    return [{ name: Property.ARM_STATE }];
  }
}
