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

import GenericDevice from './genericDevice.js';
import { NetworkAccess } from '../attributes/index.js';

/**
 * Defines network device type class
 * @extends GenericDevice
 */
export default class NetworkDevice extends GenericDevice {
  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [NetworkAccess, ...super.supportedAttributes];
  }
}
