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
import { CustomActionSemantic } from '#alexa/smarthome/semantics.js';
import DeviceAttribute from './attribute.js';

/**
 * Defines vacuum mode attribute class
 * @extends DeviceAttribute
 */
export default class VacuumMode extends DeviceAttribute {
  /**
   * Defines clean mode
   * @type {String}
   */
  static CLEAN = 'CLEAN';

  /**
   * Defines dock mode
   * @type {String}
   */
  static DOCK = 'DOCK';

  /**
   * Defines spot mode
   * @type {String}
   */
  static SPOT = 'SPOT';

  /**
   * Defines pause mode
   * @type {String}
   */
  static PAUSE = 'PAUSE';

  /**
   * Defines stop mode
   * @type {String}
   */
  static STOP = 'STOP';

  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return ['VacuumMode'];
  }

  /**
   * Returns supported modes
   * @return {Array}
   */
  static get supportedModes() {
    return [VacuumMode.CLEAN, VacuumMode.DOCK, VacuumMode.SPOT, VacuumMode.PAUSE, VacuumMode.STOP];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_MODE];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @return {Array}
   */
  static getCapabilities(item, metadata) {
    const itemType = item.groupType || item.type;
    const mappings = Object.entries(metadata.config)
      .filter(([mode]) => this.supportedModes.includes(mode))
      .reduce((mappings, [mode, value]) => ({ ...mappings, [mode]: value }), {});
    const supportsMode = (mode) => !Object.keys(mappings).length || typeof mappings[mode] !== 'undefined';
    const getMode = (mode) => {
      if (typeof mappings[mode] !== 'undefined') return mappings[mode];
      if (itemType === ItemType.NUMBER) return this.supportedModes.findIndex((value) => value === mode) + 1;
      return mode;
    };

    // Return if clean or dock mode not supported
    if (!supportsMode(VacuumMode.CLEAN) || !supportsMode(VacuumMode.DOCK)) {
      return;
    }

    switch (itemType) {
      // Number/String control
      case ItemType.NUMBER:
      case ItemType.STRING:
        return [
          {
            name: Capability.MODE_CONTROLLER,
            instance: VacuumMode.name,
            property: Property.MODE,
            parameters: {
              capabilityNames: VacuumMode.capabilityNames,
              supportedModes: {
                [VacuumMode.CLEAN]: [AlexaAssetCatalog.SETTING_CLEAN],
                [VacuumMode.DOCK]: [AlexaAssetCatalog.SETTING_DOCK],
                ...(supportsMode(VacuumMode.SPOT) && { [VacuumMode.SPOT]: [AlexaAssetCatalog.SETTING_SPOT] }),
                ...(supportsMode(VacuumMode.PAUSE) && { [VacuumMode.PAUSE]: [AlexaAssetCatalog.VALUE_PAUSE] }),
                ...(supportsMode(VacuumMode.STOP) && { [VacuumMode.STOP]: [AlexaAssetCatalog.VALUE_STOP] })
              },
              // Add value mappings for number item type
              ...(itemType === ItemType.NUMBER && {
                [VacuumMode.CLEAN]: getMode(VacuumMode.CLEAN),
                [VacuumMode.DOCK]: getMode(VacuumMode.DOCK),
                ...(supportsMode(VacuumMode.SPOT) && { [VacuumMode.SPOT]: getMode(VacuumMode.SPOT) }),
                ...(supportsMode(VacuumMode.PAUSE) && { [VacuumMode.PAUSE]: getMode(VacuumMode.PAUSE) }),
                ...(supportsMode(VacuumMode.STOP) && { [VacuumMode.STOP]: getMode(VacuumMode.STOP) })
              })
            }
          },
          {
            name: Capability.POWER_CONTROLLER,
            property: Property.POWER_STATE,
            parameters: {
              actionMappings: {
                [CustomActionSemantic.TURN_ON]: getMode(VacuumMode.CLEAN),
                [CustomActionSemantic.TURN_OFF]: getMode(VacuumMode.DOCK)
              }
            }
          },
          {
            name: Capability.PLAYBACK_CONTROLLER,
            property: Property.PLAYBACK_ACTION,
            parameters: {
              actionMappings: {
                ...(supportsMode(VacuumMode.PAUSE) && {
                  [CustomActionSemantic.RESUME]: getMode(VacuumMode.CLEAN),
                  [CustomActionSemantic.PAUSE]: getMode(VacuumMode.PAUSE)
                }),
                [CustomActionSemantic.STOP]: supportsMode(VacuumMode.STOP)
                  ? getMode(VacuumMode.STOP)
                  : getMode(VacuumMode.DOCK)
              }
            }
          }
        ];
    }
  }
}
