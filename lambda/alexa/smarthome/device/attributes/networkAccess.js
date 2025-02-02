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

import { ItemType } from '#openhab/constants.js';
import AlexaAssetCatalog from '#alexa/smarthome/catalog.js';
import { Capability, Property } from '#alexa/smarthome/constants.js';
import DeviceAttribute from './attribute.js';

/**
 * Defines network access attribute class
 * @extends DeviceAttribute
 */
export default class NetworkAccess extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['NetworkAccess'];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_NETWORK_ACCESS];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @return {Array}
   */
  static getCapabilities(item) {
    const itemType = item.groupType || item.type;

    switch (itemType) {
      // Switch on/off control
      case ItemType.SWITCH:
        return [
          {
            name: Capability.TOGGLE_CONTROLLER,
            instance: NetworkAccess.name,
            property: Property.TOGGLE_STATE,
            parameters: {
              capabilityNames: NetworkAccess.capabilityNames
            }
          }
        ];
    }
  }
}
