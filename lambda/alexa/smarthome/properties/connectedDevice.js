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

const { isMACAddress } = require('@root/utils');
const { ItemType } = require('@openhab/constants');
const { Capability } = require('../constants');
const AlexaDevice = require('../device');
const { Parameter, ParameterType } = require('../metadata');
const AlexaProperty = require('./property');

/**
 * Defines connected device property class
 * @extends AlexaProperty
 */
class ConnectedDevice extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.GROUP];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.CONNECTED_TO]: ParameterType.STRING,
      [Parameter.DEVICE_NAME]: ParameterType.STRING,
      [Parameter.HOSTNAME]: ParameterType.STRING,
      [Parameter.MAC_ADDRESS]: ParameterType.STRING
    };
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.connectedTo && this.deviceName && this.hostname && isMACAddress(this.macAddress);
  }

  /**
   * Returns connected to based on parameter
   * @return {String}
   */
  get connectedTo() {
    return this.parameters[Parameter.CONNECTED_TO];
  }

  /**
   * Returns device name based on parameter
   * @return {String}
   */
  get deviceName() {
    return this.parameters[Parameter.DEVICE_NAME];
  }

  /**
   * Returns hostname based on parameter
   * @return {String}
   */
  get hostname() {
    return this.parameters[Parameter.HOSTNAME] || 'N/A';
  }

  /**
   * Returns mac address system based on parameter
   * @return {String}
   */
  get macAddress() {
    return this.parameters[Parameter.MAC_ADDRESS];
  }

  /**
   * Updates parameters
   * @param {Object} item
   * @param {Object} metadata
   * @param {Object} settings
   * @param {Array}  groups
   */
  updateParameters(item, metadata, settings, groups) {
    const parameters = this.parameters;
    // Update parameters from parent method
    super.updateParameters(item, metadata, settings);

    // Determine router group based on group device type with home network controller capability
    const router = groups
      .filter((group) => item.groupNames.includes(group.name) && group.metadata && group.metadata.alexa)
      .find(({ metadata }) => {
        const { groupCapabilities = [] } = AlexaDevice.getDeviceType(metadata.alexa.value) || {};
        return groupCapabilities.some(({ name }) => name === Capability.NETWORKING_HOME_NETWORK_CONTROLLER);
      });
    // Set connected to parameter using router group name if found
    parameters[Parameter.CONNECTED_TO] = router && router.name;
    // Set device name parameter using metadata config name parameter, otherwise item label
    parameters[Parameter.DEVICE_NAME] = metadata.config.name || item.label;
  }
}

module.exports = ConnectedDevice;
