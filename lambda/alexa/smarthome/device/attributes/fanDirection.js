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

import { ItemType, ItemValue } from '#openhab/constants.js';
import AlexaAssetCatalog from '#alexa/smarthome/catalog.js';
import { Capability, Property, Parameter, ParameterType } from '#alexa/smarthome/constants.js';
import DeviceAttribute from './attribute.js';

/**
 * Defines fan direction attribute class
 * @extends DeviceAttribute
 */
export default class FanDirection extends DeviceAttribute {
  /**
   * Defines forward direction
   * @type {String}
   */
  static FORWARD = 'FORWARD';

  /**
   * Defines reverse direction
   * @type {String}
   */
  static REVERSE = 'REVERSE';

  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['FanDirection'];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_DIRECTION];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @return {Array}
   */
  static getCapabilities(item, metadata) {
    const itemType = item.groupType || item.type;
    const isInverted = metadata.getConfigParameter(Parameter.INVERTED, ParameterType.BOOLEAN) === true;

    switch (itemType) {
      // String forward/reverse control
      case ItemType.STRING:
        return [
          {
            name: Capability.MODE_CONTROLLER,
            instance: FanDirection.name,
            property: Property.MODE,
            parameters: {
              capabilityNames: FanDirection.capabilityNames,
              supportedModes: {
                [FanDirection.FORWARD]: [AlexaAssetCatalog.SETTING_FORWARD],
                [FanDirection.REVERSE]: [AlexaAssetCatalog.SETTING_REVERSE]
              }
            }
          }
        ];
      // Switch forward/reverse control
      case ItemType.SWITCH:
        return [
          {
            name: Capability.MODE_CONTROLLER,
            instance: FanDirection.name,
            property: Property.MODE,
            parameters: {
              capabilityNames: FanDirection.capabilityNames,
              supportedModes: isInverted
                ? {
                    [ItemValue.ON]: [AlexaAssetCatalog.SETTING_REVERSE],
                    [ItemValue.OFF]: [AlexaAssetCatalog.SETTING_FORWARD]
                  }
                : {
                    [ItemValue.ON]: [AlexaAssetCatalog.SETTING_FORWARD],
                    [ItemValue.OFF]: [AlexaAssetCatalog.SETTING_REVERSE]
                  }
            }
          }
        ];
    }
  }
}
