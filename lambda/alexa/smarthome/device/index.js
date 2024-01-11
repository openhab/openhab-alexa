/**
 * Copyright (c) 2010-2024 Contributors to the openHAB project
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

import * as DeviceAttributes from './attributes/index.js';
import * as DeviceTypes from './types/index.js';

/**
 * Defines alexa device class
 */
export default class AlexaDevice {
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
  static from(value, groupType) {
    const parameters = value.split('.', 2);
    let type, attribute;

    // Determine device type and attribute based on metadata value parameters:
    //  1) Specific device type and undefined attribute (e.g. Light)
    //  2) Specific device type and attribute (e.g. Light.PowerState)
    //  3) Specific attribute only (e.g. PowerState)
    if (this.getDeviceType(parameters[0])) {
      if (parameters.length === 1) {
        type = this.getDeviceType(parameters[0]);
        attribute = undefined;
      } else if (this.getDeviceAttributes(parameters[1])) {
        type = this.getDeviceType(parameters[0]);
        attribute = this.getDeviceAttributes(parameters[1]);
      }
    } else if (this.getDeviceAttributes(parameters[0])) {
      // Use group or dummy device type when not found
      type = groupType || DeviceTypes.Dummy;
      attribute = this.getDeviceAttributes(parameters[0]);
    }

    // Return new device object if type defined
    if (type) {
      return new AlexaDevice(type, attribute, groupType);
    }
  }

  /**
   * Returns device attribute based on given name
   * @param  {String} name
   * @return {Object}
   */
  static getDeviceAttributes(name) {
    return Object.values(DeviceAttributes).find((attribute) => attribute.supportedNames?.includes(name));
  }

  /**
   * Returns device type based on given name
   * @param  {String} name
   * @return {Object}
   */
  static getDeviceType(name) {
    return Object.values(DeviceTypes).find(
      (type) =>
        type.supportedNames?.includes(name) ||
        // Fallback to display category for backward compatibility
        type.displayCategories?.includes(name)
    );
  }
}
