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
const AlexaAssetCatalog = require('@alexa/smarthome/catalog');
const { Capability, Property } = require('@alexa/smarthome/constants');
const DeviceAttribute = require('./attribute');

/**
 * Defines fan oscillate attribute class
 * @extends DeviceAttribute
 */
class FanOscillate extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['FanOscillate'];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_OSCILLATE];
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
            instance: FanOscillate.name,
            property: Property.TOGGLE_STATE,
            parameters: {
              capabilityNames: FanOscillate.capabilityNames
            }
          }
        ];
    }
  }
}

module.exports = FanOscillate;
