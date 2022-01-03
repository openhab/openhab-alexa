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

const { ItemType, ItemValue } = require('@openhab/constants');
const AlexaAssetCatalog = require('@alexa/smarthome/catalog');
const { Capability, Property } = require('@alexa/smarthome/constants');
const { Parameter, ParameterType } = require('@alexa/smarthome/metadata');
const DecoupleState = require('@alexa/smarthome/properties/decoupleState');
const { AlexaActionSemantic, AlexaStateSemantic } = require('@alexa/smarthome/semantics');
const DeviceAttribute = require('./attribute');

/**
 * Defines open state attribute class
 * @extends DeviceAttribute
 */
class OpenState extends DeviceAttribute {
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
        if (this.tag !== DecoupleState.TAG_NAME) return;
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
              ...(this.tag !== DecoupleState.TAG_NAME && {
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

module.exports = OpenState;
