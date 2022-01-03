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
const { Parameter, ParameterType } = require('@alexa/smarthome/metadata');
const DeviceAttribute = require('./attribute');

/**
 * Defines input attribute class
 * @extends DeviceAttribute
 */
class Input extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return [
      'Input',
      'EntertainmentInput' // For backward compatibility (deprecated)
    ];
  }

  /**
   * Returns capability names
   * @return {Array}
   */
  static get capabilityNames() {
    return [AlexaAssetCatalog.SETTING_INPUT];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @return {Array}
   */
  static getCapabilities(item, metadata) {
    const itemType = item.groupType || item.type;
    const supportedInputs = metadata.getConfigParameter(Parameter.SUPPORTED_INPUTS, ParameterType.MAP);

    switch (itemType) {
      case ItemType.NUMBER:
      case ItemType.STRING:
        return [
          {
            name: Capability.MODE_CONTROLLER,
            instance: Input.name,
            property: Property.MODE,
            parameters: {
              capabilityNames: Input.capabilityNames,
              supportedModes: supportedInputs
            }
          }
        ];
    }
  }
}

module.exports = Input;
