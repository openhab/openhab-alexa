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

import { ItemType } from '#openhab/constants.js';
import AlexaAssetCatalog from '#alexa/smarthome/catalog.js';
import { Capability, Property } from '#alexa/smarthome/constants.js';
import DeviceAttribute from './attribute.js';

/**
 * Defines thermostat fan attribute class
 * @extends DeviceAttribute
 */
export default class ThermostatFan extends DeviceAttribute {
  /**
   * Defines fan auto
   * @type {String}
   */
  static AUTO = 'AUTO';

  /**
   * Define fan on
   * @type {String}
   */
  static ON = 'ON';

  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['ThermostatFan'];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.DEVICE_NAME_FAN];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @return {Array}
   */
  static getCapabilities(item) {
    const itemType = item.groupType || item.type;

    switch (itemType) {
      // String auto/on control
      case ItemType.STRING:
        return [
          {
            name: Capability.MODE_CONTROLLER,
            instance: ThermostatFan.name,
            property: Property.MODE,
            parameters: {
              capabilityNames: ThermostatFan.capabilityNames,
              supportedModes: {
                [ThermostatFan.AUTO]: [AlexaAssetCatalog.VALUE_DEFAULT],
                [ThermostatFan.ON]: [AlexaAssetCatalog.VALUE_ON]
              }
            }
          }
        ];
      // Switch on/off control
      case ItemType.SWITCH:
        return [
          {
            name: Capability.TOGGLE_CONTROLLER,
            instance: ThermostatFan.name,
            property: Property.TOGGLE_STATE,
            parameters: {
              capabilityNames: ThermostatFan.capabilityNames
            }
          }
        ];
    }
  }
}
