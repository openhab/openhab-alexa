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

const DeviceAttributes = require('./attributes');
const DeviceTypes = require('./types');

/**
 * Defines alexa device class
 */
class AlexaDevice {
  /**
   * Constructor
   * @param {Object} type
   * @param {Object} attribute
   * @param {Object} groupType
   */
  constructor(type, attribute, groupType) {
    this._device = { type, attribute, groupType };
  }

  /**
   * Returns device type display categories
   * @return {Array}
   */
  get displayCategories() {
    return this._device.type.displayCategories;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.supportsAttribute && this.supportsGroupType;
  }

  /**
   * Returns if supports attribute
   * @return {Boolean}
   */
  get supportsAttribute() {
    const { type, attribute } = this._device;
    const { supportedAttributes } = type;
    // Support, if attribute defined, based on device type supported attributes if not empty
    return !attribute || supportedAttributes.length === 0 || supportedAttributes.includes(attribute);
  }

  /**
   * Returns if supports group type
   * @return {Boolean}
   */
  get supportsGroupType() {
    const { type, groupType } = this._device;
    // Support, if group type defined, based on one of the following criteria:
    //  1) device type equal to group one
    //  2) device type equal to switch (backward compatibility for 'Switchable' used as 'PowerState' in groups)
    return !groupType || type === groupType || type === DeviceTypes.Switch;
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @param  {Object} settings
   * @return {Array}
   */
  getCapabilities(item, metadata, settings) {
    // Determine capability attribute(s) based on defined attribute, fallback to device type default attributes
    const attributes = [].concat(this._device.attribute || this._device.type.defaultAttributes);
    const categories = this._device.type.displayCategories;
    const capabilities = [];

    for (const attribute of attributes) {
      capabilities.push(...(attribute.getCapabilities(item, metadata, settings, categories) || []));
    }

    return capabilities;
  }

  /**
   * Returns new device object based on given metadata value
   * @param  {String} value
   * @param  {Object} groupType
   * @return {Object}
   */
  static getDevice(value, groupType) {
    const parameters = value.split('.');
    let type, attribute;

    // Determine device type and attribute based on metadata value parameters:
    //  1) Specific device type and undefined attribute (e.g. Light)
    //  2) Specific device type and attribute (e.g. Light.PowerState)
    //  3) Specific attribute only (e.g. PowerState)
    if (DeviceTypes.get(parameters[0])) {
      if (parameters.length === 1) {
        type = DeviceTypes.get(parameters[0]);
        attribute = undefined;
      } else if (DeviceAttributes.get(parameters[1])) {
        type = DeviceTypes.get(parameters[0]);
        attribute = DeviceAttributes.get(parameters[1]);
      }
    } else if (DeviceAttributes.get(parameters[0])) {
      // Use group or dummy device type when not found
      type = groupType || DeviceTypes.Dummy;
      attribute = DeviceAttributes.get(parameters[0]);
    }

    // Return new device object if type defined
    if (type) {
      return new AlexaDevice(type, attribute, groupType);
    }
  }

  /**
   * Returns device type based on given name
   * @param  {String} name
   * @return {Object}
   */
  static getDeviceType(name) {
    return DeviceTypes.get(name);
  }
}

module.exports = AlexaDevice;
