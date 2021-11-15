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

const { ItemType, ItemValue } = require('@openhab/constants');
const { Property } = require('../constants');
const AlexaProperty = require('./property');

/**
 * Defines thermostat hold property class
 * @extends AlexaProperty
 */
class ThermostatHold extends AlexaProperty {
  /**
   * Defines resume state
   * @type {String}
   */
  static RESUME = 'RESUME';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.NUMBER, ItemType.STRING, ItemType.SWITCH];
  }

  /**
   * Returns supported values
   * @return {Array}
   */
  get supportedValues() {
    return [ThermostatHold.RESUME];
  }

  /**
   * Returns required linked properties
   * @return {Array}
   */
  get requiredLinkedProperties() {
    return [{ name: Property.THERMOSTAT_MODE }];
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }

  /**
   * Returns default value map based on item type
   * @return {Object}
   */
  get defaultValueMap() {
    switch (this.item.type) {
      case ItemType.NUMBER:
        return { RESUME: 0 };
      case ItemType.STRING:
        return { RESUME: 'resume' };
      case ItemType.SWITCH:
        return { RESUME: ItemValue.OFF };
      default:
        return {};
    }
  }
}

module.exports = ThermostatHold;
