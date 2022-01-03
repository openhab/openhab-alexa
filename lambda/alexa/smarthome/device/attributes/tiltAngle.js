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
const { AlexaActionSemantic, AlexaStateSemantic, CustomActionSemantic } = require('@alexa/smarthome/semantics');
const AlexaUnitOfMeasure = require('@alexa/smarthome/unitOfMeasure');
const DeviceAttribute = require('./attribute');

/**
 * Defines tilt angle attribute class
 * @extends DeviceAttribute
 */
class TiltAngle extends DeviceAttribute {
  /**
   * Defines tilt primary control
   * @type {String}
   */
  static PRIMARY_CONTROL = 'tilt';

  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['TiltAngle'];
  }

  /**
   * Returns command name
   * @type {String}
   */
  static get commandName() {
    return 'TiltCommand';
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_TILT, AlexaAssetCatalog.SETTING_ANGLE, AlexaAssetCatalog.SETTING_DIRECTION];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @return {Array}
   */
  static getCapabilities(item, metadata) {
    const itemType = item.groupType || item.type;
    const isInverted = metadata.getConfigParameter(Parameter.INVERTED, ParameterType.BOOLEAN);
    const primaryControl = metadata.getConfigParameter(Parameter.PRIMARY_CONTROL);
    const hasPrimaryControl = !metadata.isPartOfGroupEndpoint || primaryControl === TiltAngle.PRIMARY_CONTROL;

    switch (itemType) {
      // Dimmer percentage control (not inverted by default)
      case ItemType.DIMMER:
        return [
          {
            name: Capability.RANGE_CONTROLLER,
            instance: TiltAngle.name,
            property: Property.RANGE_VALUE,
            parameters: {
              capabilityNames: TiltAngle.capabilityNames,
              supportedRange: [0, 100, 1],
              unitOfMeasure: AlexaUnitOfMeasure.PERCENT,
              ...(hasPrimaryControl &&
                (isInverted === true
                  ? {
                      actionMappings: { [AlexaActionSemantic.CLOSE]: '100', [AlexaActionSemantic.OPEN]: '0' },
                      stateMappings: { [AlexaStateSemantic.CLOSED]: '100', [AlexaStateSemantic.OPEN]: '0:99' }
                    }
                  : {
                      actionMappings: { [AlexaActionSemantic.CLOSE]: '0', [AlexaActionSemantic.OPEN]: '100' },
                      stateMappings: { [AlexaStateSemantic.CLOSED]: '0', [AlexaStateSemantic.OPEN]: '1:100' }
                    }))
            }
          }
        ];
      // Number angle degrees control (not inverted by default)
      case ItemType.NUMBER:
      case ItemType.NUMBER_ANGLE:
        return [
          {
            name: Capability.RANGE_CONTROLLER,
            instance: TiltAngle.name,
            property: Property.RANGE_VALUE,
            parameters: {
              capabilityNames: TiltAngle.capabilityNames,
              supportedRange: [-90, 90, 1],
              unitOfMeasure: AlexaUnitOfMeasure.ANGLE_DEGREES,
              ...(hasPrimaryControl &&
                (isInverted === true
                  ? {
                      actionMappings: { [AlexaActionSemantic.CLOSE]: '90', [AlexaActionSemantic.OPEN]: '0' },
                      stateMappings: { [AlexaStateSemantic.CLOSED]: '90', [AlexaStateSemantic.OPEN]: '-89:89' }
                    }
                  : {
                      actionMappings: { [AlexaActionSemantic.CLOSE]: '-90', [AlexaActionSemantic.OPEN]: '0' },
                      stateMappings: { [AlexaStateSemantic.CLOSED]: '-90', [AlexaStateSemantic.OPEN]: '-89:89' }
                    }))
            }
          }
        ];
      // Rollershutter percentage control (inverted by default) with up/down/stop commands
      case ItemType.ROLLERSHUTTER:
        return [
          {
            name: Capability.MODE_CONTROLLER,
            instance: TiltAngle.commandName,
            property: Property.MODE,
            parameters: {
              capabilityNames: TiltAngle.capabilityNames,
              supportedCommands: {
                [ItemValue.UP]: [AlexaAssetCatalog.VALUE_UP],
                [ItemValue.DOWN]: [AlexaAssetCatalog.VALUE_DOWN],
                [ItemValue.STOP]: [AlexaAssetCatalog.VALUE_STOP]
              },
              ...(hasPrimaryControl && {
                actionMappings: {
                  [AlexaActionSemantic.CLOSE]: ItemValue.DOWN,
                  [AlexaActionSemantic.OPEN]: ItemValue.UP
                }
              })
            }
          },
          {
            name: Capability.RANGE_CONTROLLER,
            instance: TiltAngle.name,
            property: Property.RANGE_VALUE,
            parameters: {
              capabilityNames: TiltAngle.capabilityNames,
              supportedRange: [0, 100, 1],
              unitOfMeasure: AlexaUnitOfMeasure.PERCENT,
              ...(hasPrimaryControl && {
                stateMappings:
                  isInverted !== false
                    ? { [AlexaStateSemantic.CLOSED]: '100', [AlexaStateSemantic.OPEN]: '0:99' }
                    : { [AlexaStateSemantic.CLOSED]: '0', [AlexaStateSemantic.OPEN]: '1:100' }
              })
            }
          },
          ...(hasPrimaryControl
            ? [
                {
                  name: Capability.PLAYBACK_CONTROLLER,
                  property: Property.PLAYBACK_ACTION,
                  parameters: {
                    actionMappings: { [CustomActionSemantic.STOP]: ItemValue.STOP }
                  }
                }
              ]
            : [])
        ];
    }
  }
}

module.exports = TiltAngle;
