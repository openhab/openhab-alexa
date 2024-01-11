/**
 * Copyright (c) 2010-2024 Contributors to the openHAB project
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

import { ItemType } from '#openhab/constants.js';
import { Capability, Property } from '#alexa/smarthome/constants.js';
import DeviceAttribute from './attribute.js';

/**
 * Defines mode attribute class
 * @extends DeviceAttribute
 */
export default class Mode extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return [
      'Mode',
      'ModeComponent' // For backward compatibility (deprecated)
    ];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @return {Array}
   */
  static getCapabilities(item) {
    const itemType = item.groupType || item.type;

    switch (itemType) {
      // Number/String mode with switch and action controls
      case ItemType.NUMBER:
      case ItemType.STRING:
        return [
          { name: Capability.MODE_CONTROLLER, property: Property.MODE },
          { name: Capability.POWER_CONTROLLER, property: Property.POWER_STATE },
          { name: Capability.PLAYBACK_CONTROLLER, property: Property.PLAYBACK_ACTION }
        ];
      // Switch mode with action controls
      case ItemType.SWITCH:
        return [
          { name: Capability.MODE_CONTROLLER, property: Property.MODE },
          { name: Capability.PLAYBACK_CONTROLLER, property: Property.PLAYBACK_ACTION }
        ];
    }
  }
}
