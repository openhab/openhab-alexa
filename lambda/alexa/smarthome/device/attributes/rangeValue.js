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

const { ItemType } = require('@openhab/constants');
const { Capability, Property } = require('@alexa/smarthome/constants');
const DeviceAttribute = require('./attribute');

/**
 * Defines range value attribute class
 * @extends DeviceAttribute
 */
class RangeValue extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return [
      'RangeValue',
      'RangeComponent' // For backward compatibility (deprecated)
    ];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @return {Array}
   */
  static getCapabilities(item) {
    const [itemType, dimension] = (item.groupType || item.type).split(':', 2);

    switch (itemType) {
      // Dimmer range with command and action controls
      case ItemType.DIMMER:
        return [
          { name: Capability.RANGE_CONTROLLER, property: Property.RANGE_VALUE },
          { name: Capability.MODE_CONTROLLER, property: Property.MODE },
          { name: Capability.PLAYBACK_CONTROLLER, property: Property.PLAYBACK_ACTION }
        ];
      // Number range with switch and action controls if dimension not defined
      case ItemType.NUMBER:
        return [
          { name: Capability.RANGE_CONTROLLER, property: Property.RANGE_VALUE },
          ...(!dimension
            ? [
                { name: Capability.POWER_CONTROLLER, property: Property.POWER_STATE },
                { name: Capability.PLAYBACK_CONTROLLER, property: Property.PLAYBACK_ACTION }
              ]
            : [])
        ];
      // Rollershutter range with command and action controls
      case ItemType.ROLLERSHUTTER:
        return [
          { name: Capability.RANGE_CONTROLLER, property: Property.RANGE_VALUE },
          { name: Capability.MODE_CONTROLLER, property: Property.MODE },
          { name: Capability.PLAYBACK_CONTROLLER, property: Property.PLAYBACK_ACTION }
        ];
    }
  }
}

module.exports = RangeValue;
