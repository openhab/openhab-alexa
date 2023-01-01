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

import { ItemType, ItemValue } from '#openhab/constants.js';
import AlexaAssetCatalog from '#alexa/smarthome/catalog.js';
import { Capability, Property } from '#alexa/smarthome/constants.js';
import { Parameter, ParameterType } from '#alexa/smarthome/metadata.js';
import { DecoupleState } from '#alexa/smarthome/properties/index.js';
import { AlexaActionSemantic, AlexaStateSemantic } from '#alexa/smarthome/semantics.js';
import DeviceAttribute from './attribute.js';

/**
 * Defines open state attribute class
 * @extends DeviceAttribute
 */
export default class OpenState extends DeviceAttribute {
  /**
   * Defines open state
   * @type {String}
   */
  static OPEN = 'OPEN';

  /**
   * Defines closed state
   * @type {String}
   */
  static CLOSED = 'CLOSED';

  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['OpenState', 'TargetOpenState'];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_OPENING];
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
      // Contact/Number/String status only if decouple state tagged
      case ItemType.CONTACT:
      case ItemType.NUMBER:
      case ItemType.STRING:
        if (this.tag !== DecoupleState.TAG_SENSOR) return;
      // fall through
      case ItemType.SWITCH:
        return [
          {
            name: Capability.MODE_CONTROLLER,
            instance: OpenState.name,
            property: Property.MODE,
            tag: this.tag,
            parameters: {
              capabilityNames: OpenState.capabilityNames,
              supportedModes: {
                [OpenState.OPEN]: [AlexaAssetCatalog.VALUE_OPEN],
                [OpenState.CLOSED]: [AlexaAssetCatalog.VALUE_CLOSE]
              },
              // Add semantic mappings map if not decouple state tagged
              ...(this.tag !== DecoupleState.TAG_SENSOR && {
                actionMappings: {
                  [AlexaActionSemantic.CLOSE]: OpenState.CLOSED,
                  [AlexaActionSemantic.OPEN]: OpenState.OPEN,
                  [AlexaActionSemantic.LOWER]: OpenState.CLOSED,
                  [AlexaActionSemantic.RAISE]: OpenState.OPEN
                },
                stateMappings: {
                  [AlexaStateSemantic.CLOSED]: OpenState.CLOSED,
                  [AlexaStateSemantic.OPEN]: OpenState.OPEN
                }
              }),
              // Add value mappings based on item type
              ...(itemType === ItemType.CONTACT && {
                [OpenState.CLOSED]: isInverted ? ItemValue.OPEN : ItemValue.CLOSED,
                [OpenState.OPEN]: isInverted ? ItemValue.CLOSED : ItemValue.OPEN
              }),
              ...(itemType === ItemType.NUMBER && {
                [OpenState.CLOSED]: 0,
                [OpenState.OPEN]: 1
              }),
              ...(itemType === ItemType.SWITCH && {
                [OpenState.CLOSED]: isInverted ? ItemValue.ON : ItemValue.OFF,
                [OpenState.OPEN]: isInverted ? ItemValue.OFF : ItemValue.ON
              })
            }
          }
        ];
    }
  }
}
