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
import { AlexaUnitOfMeasure } from '#alexa/smarthome/unitOfMeasure.js';
import DeviceAttribute from './attribute.js';

/**
 * Defines humidity attribute class
 * @extends DeviceAttribute
 */
export default class Humidity extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['CurrentHumidity'];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_HUMIDITY];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @return {Array}
   */
  static getCapabilities(item) {
    const itemType = item.groupType || item.type;

    switch (itemType) {
      case ItemType.DIMMER:
      case ItemType.NUMBER:
      case ItemType.NUMBER_DIMENSIONLESS:
        return [
          {
            name: Capability.RANGE_CONTROLLER,
            instance: Humidity.name,
            property: Property.RANGE_VALUE,
            parameters: {
              capabilityNames: Humidity.capabilityNames,
              nonControllable: true,
              supportedRange: [0, 100, 1],
              unitOfMeasure: AlexaUnitOfMeasure.PERCENT
            }
          }
        ];
    }
  }
}
