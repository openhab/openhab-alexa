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
 * Defines position state attribute class
 * @extends DeviceAttribute
 */
class PositionState extends DeviceAttribute {
  /**
   * Defines position primary control
   * @type {String}
   */
  static PRIMARY_CONTROL = 'position';

  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['PositionState'];
  }

  /**
   * Returns command name
   * @type {String}
   */
  static get commandName() {
    return 'PositionCommand';
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_POSTION, AlexaAssetCatalog.SETTING_OPENING];
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
    const primaryControl = metadata.getConfigParameter(Parameter.PRIMARY_CONTROL) || PositionState.PRIMARY_CONTROL;
    const hasPrimaryControl = !metadata.isPartOfGroupEndpoint || primaryControl === PositionState.PRIMARY_CONTROL;

    switch (itemType) {
      // Dimmer control (not inverted by default)
      case ItemType.DIMMER:
        return [
          {
            name: Capability.RANGE_CONTROLLER,
            instance: PositionState.name,
            property: Property.RANGE_VALUE,
            parameters: {
              capabilityNames: PositionState.capabilityNames,
              supportedRange: [0, 100, 1],
              unitOfMeasure: AlexaUnitOfMeasure.PERCENT,
              ...((hasPrimaryControl &&
                (isInverted === true
                  ? {
                      actionMappings: {
                        [AlexaActionSemantic.CLOSE]: '100',
                        [AlexaActionSemantic.OPEN]: '0',
                        [AlexaActionSemantic.LOWER]: '100',
                        [AlexaActionSemantic.RAISE]: '0'
                      },
                      stateMappings: {
                        [AlexaStateSemantic.CLOSED]: '100',
                        [AlexaStateSemantic.OPEN]: '0:99'
                      }
                    }
                  : {
                      actionMappings: {
                        [AlexaActionSemantic.CLOSE]: '0',
                        [AlexaActionSemantic.OPEN]: '100',
                        [AlexaActionSemantic.LOWER]: '0',
                        [AlexaActionSemantic.RAISE]: '100'
                      },
                      stateMappings: {
                        [AlexaStateSemantic.CLOSED]: '0',
                        [AlexaStateSemantic.OPEN]: '1:100'
                      }
                    })) ||
                (isInverted === true
                  ? {
                      actionMappings: {
                        [AlexaActionSemantic.LOWER]: '100',
                        [AlexaActionSemantic.RAISE]: '0'
                      }
                    }
                  : {
                      actionMappings: {
                        [AlexaActionSemantic.LOWER]: '0',
                        [AlexaActionSemantic.RAISE]: '100'
                      }
                    }))
            }
          }
        ];
      // Rollershutter control with up/down/stop commands (inverted by default)
      case ItemType.ROLLERSHUTTER:
        return [
          {
            name: Capability.MODE_CONTROLLER,
            instance: PositionState.commandName,
            property: Property.MODE,
            parameters: {
              capabilityNames: PositionState.capabilityNames,
              supportedCommands: {
                [ItemValue.UP]: [AlexaAssetCatalog.VALUE_UP],
                [ItemValue.DOWN]: [AlexaAssetCatalog.VALUE_DOWN],
                [ItemValue.STOP]: [AlexaAssetCatalog.VALUE_STOP]
              },
              actionMappings: hasPrimaryControl
                ? {
                    [AlexaActionSemantic.CLOSE]: ItemValue.DOWN,
                    [AlexaActionSemantic.OPEN]: ItemValue.UP,
                    [AlexaActionSemantic.LOWER]: ItemValue.DOWN,
                    [AlexaActionSemantic.RAISE]: ItemValue.UP
                  }
                : {
                    [AlexaActionSemantic.LOWER]: ItemValue.DOWN,
                    [AlexaActionSemantic.RAISE]: ItemValue.UP
                  }
            }
          },
          {
            name: Capability.RANGE_CONTROLLER,
            instance: PositionState.name,
            property: Property.RANGE_VALUE,
            parameters: {
              capabilityNames: PositionState.capabilityNames,
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

module.exports = PositionState;
