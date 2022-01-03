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

const AlexaCapability = require('./capability');
const AlexaDisplayCategory = require('../category');
const { Interface, Property } = require('../constants');
const { ColorTemperature } = require('../properties');

/**
 * Defines Alexa.ColorTemperatureController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-colortemperaturecontroller.html
 * @extends AlexaCapability
 */
class ColorTemperatureController extends AlexaCapability {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_COLOR_TEMPERATURE_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.COLOR_TEMPERATURE]: ColorTemperature
    };
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return [AlexaDisplayCategory.LIGHT];
  }

  /**
   * Returns reportable properties
   * @param  {Array}  items
   * @param  {Object} properties
   * @return {Array}
   */
  getReportableProperties(items, properties) {
    const color = properties[Property.COLOR];
    const temperature = properties[Property.COLOR_TEMPERATURE];

    if (color && temperature) {
      const colorItem = items.find((item) => item.name === color.item.name) || {};
      const temperatureItem = items.find((item) => item.name === temperature.item.name) || {};

      // Exclude color temperature property if in color mode
      if (temperature.isInColorMode(colorItem.state, temperatureItem.state)) {
        temperatureItem.state = 0; // Set temperature item state to zero to exclude item from health check
        return this.properties.filter((property) => !(property instanceof ColorTemperature));
      }
    }

    // Return reportable properties from parent method otherwise
    return super.getReportableProperties(items, properties);
  }
}

module.exports = ColorTemperatureController;
