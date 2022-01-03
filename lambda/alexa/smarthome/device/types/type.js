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

/**
 * Defines device type base class
 */
class DeviceType {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return [];
  }

  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [];
  }

  /**
   * Returns default attributes
   * @return {Array}
   */
  static get defaultAttributes() {
    return [];
  }

  /**
   * Returns group capabilities
   * @return {Array}
   */
  static get groupCapabilities() {
    return [];
  }

  /**
   * Returns display categories
   * @return {Array}
   */
  static get displayCategories() {
    return [];
  }

  /**
   * Returns config based on given metadata
   * @param  {Object} metadata
   * @return {Object}
   */
  static getConfig(metadata) {
    return metadata.config;
  }
}

module.exports = DeviceType;
