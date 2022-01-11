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

const { Interface, Property } = require('../constants');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.ColorController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-colorcontroller.html#directives
 * @extends AlexaHandler
 */
class ColorController extends AlexaHandler {
  /**
   * Defines set color directive
   * @type {String}
   */
  static SET_COLOR = 'SetColor';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_COLOR_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [ColorController.SET_COLOR]: this.setColor
    };
  }

  /**
   * Sets the color of a color item
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setColor(directive, openhab) {
    const color = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.COLOR
    });
    const temperature = directive.endpoint.getCapabilityProperty({
      interface: Interface.ALEXA_COLOR_TEMPERATURE_CONTROLLER,
      property: Property.COLOR_TEMPERATURE
    });

    // Get color item current state if retrievable
    const state = color.isRetrievable ? await openhab.getItemState(color.item.name) : undefined;
    // Maintain the current brightness level if available
    const hsb = [
      directive.payload.color.hue,
      directive.payload.color.saturation * 100,
      (state && parseFloat(state.split(',')[2])) || directive.payload.color.brightness * 100
    ];

    // Reset color temperature state if retrievable and required
    if (temperature && temperature.isRetrievable && temperature.requiresSetColorReset) {
      await openhab.postUpdate(temperature.item.name, 0);
    }

    await openhab.sendCommand(color.item.name, hsb.join(','));

    return directive.response();
  }
}

module.exports = ColorController;
