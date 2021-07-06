/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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
const PlaybackAction = require('@alexa/smarthome/properties/playbackAction');
const PowerState = require('@alexa/smarthome/properties/powerState');
const DeviceAttribute = require('./attribute');

/**
 * Defines vacuum mode attribute class
 * @extends DeviceAttribute
 */
class VacuumMode extends DeviceAttribute {
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
   * Returns if vacuum mode is supported
   * @param  {String}  mode
   * @return {Boolean}
   */
  static isSupported(mode) {
    return this.supportedModes.includes(mode);
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @return {Array}
   */
  static getCapabilities(item, metadata) {
    const itemType = item.groupType || item.type;
    const mappings = Object.fromEntries(Object.entries(metadata.config).filter(([mode]) => this.isSupported(mode)));
    const supportsMode = (mode) => !Object.keys(mappings).length || typeof mappings[mode] !== 'undefined';
    const getDefault = (mode) =>
      itemType === ItemType.NUMBER ? this.supportedModes.findIndex((value) => value === mode) + 1 : mode;

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
                [VacuumMode.CLEAN]: getDefault(VacuumMode.CLEAN),
                [VacuumMode.DOCK]: getDefault(VacuumMode.DOCK),
                ...(supportsMode(VacuumMode.SPOT) && { [VacuumMode.SPOT]: getDefault(VacuumMode.SPOT) }),
                ...(supportsMode(VacuumMode.PAUSE) && { [VacuumMode.PAUSE]: getDefault(VacuumMode.PAUSE) }),
                ...(supportsMode(VacuumMode.STOP) && { [VacuumMode.STOP]: getDefault(VacuumMode.STOP) })
              })
            }
          },
          {
            name: Capability.POWER_CONTROLLER,
            property: Property.POWER_STATE,
            parameters: {
              [PowerState.ON]: typeof mappings.CLEAN !== 'undefined' ? mappings.CLEAN : getDefault(VacuumMode.CLEAN),
              [PowerState.OFF]: typeof mappings.DOCK !== 'undefined' ? mappings.DOCK : getDefault(VacuumMode.DOCK)
            }
          },
          {
            name: Capability.PLAYBACK_CONTROLLER,
            property: Property.PLAYBACK_ACTION,
            parameters: {
              actionMappings: {
                ...(supportsMode(VacuumMode.PAUSE) && {
                  [PlaybackAction.RESUME]: VacuumMode.CLEAN,
                  [PlaybackAction.PAUSE]: VacuumMode.PAUSE
                }),
                ...(supportsMode(VacuumMode.STOP)
                  ? { [PlaybackAction.STOP]: VacuumMode.STOP }
                  : { [PlaybackAction.STOP]: VacuumMode.DOCK })
              },
              // Add value mappings for number item type
              ...(itemType === ItemType.NUMBER && {
                ...(supportsMode(VacuumMode.PAUSE) && {
                  [VacuumMode.CLEAN]: getDefault(VacuumMode.CLEAN),
                  [VacuumMode.PAUSE]: getDefault(VacuumMode.PAUSE)
                }),
                ...(supportsMode(VacuumMode.STOP)
                  ? { [VacuumMode.STOP]: getDefault(VacuumMode.STOP) }
                  : { [VacuumMode.DOCK]: getDefault(VacuumMode.DOCK) })
              })
            }
          }
        ];
    }
  }
}

module.exports = VacuumMode;
