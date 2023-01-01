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

import AlexaDisplayCategory from '#alexa/smarthome/category.js';
import { Capability } from '#alexa/smarthome/constants.js';
import GenericDevice from './genericDevice.js';

/**
 * Defines network hardware device type class
 * @extends GenericDevice
 */
export default class NetworkHardware extends GenericDevice {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['NetworkHardware'];
  }

  /**
   * Returns group capabilities
   * @return {Array}
   */
  static get groupCapabilities() {
    return [{ name: Capability.NETWORKING_HOME_NETWORK_CONTROLLER }];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [AlexaDisplayCategory.NETWORK_HARDWARE];
  }
}
