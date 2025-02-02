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

import AlexaCapability from './capability.js';
import AlexaDisplayCategory from '../category.js';
import { Capability, Interface, Property } from '../constants.js';
import { Color } from '../properties/index.js';

/**
 * Defines Alexa.ColorController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-colorcontroller.html
 * @extends AlexaCapability
 */
export default class ColorController extends AlexaCapability {
  /**
   * Returns name
   * @return {String}
   */
  static get name() {
    return Capability.COLOR_CONTROLLER;
  }

  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_COLOR_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.COLOR]: Color
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
      const colorItem = items.find((item) => item.name === color.item.name);
      const temperatureItem = items.find((item) => item.name === temperature.item.name);

      // Exclude color property if not in color mode
      if (!temperature.isInColorMode(colorItem?.state, temperatureItem?.state)) {
        return this.properties.filter((property) => !(property instanceof Color));
      }
    }

    // Return reportable properties from parent method otherwise
    return super.getReportableProperties(items, properties);
  }
}
