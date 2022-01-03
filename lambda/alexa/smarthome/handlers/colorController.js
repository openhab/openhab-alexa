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
    const { item, isRetrievable } = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.COLOR
    });
    // Get item current state if retrievable
    const state = isRetrievable ? await openhab.getItemState(item.name) : undefined;
    // Maintain the current brightness level if available
    const hsb = [
      directive.payload.color.hue,
      directive.payload.color.saturation * 100,
      (state && parseFloat(state.split(',')[2])) || directive.payload.color.brightness * 100
    ];

    await openhab.sendCommand(item.name, hsb.join(','));

    return directive.response();
  }
}

module.exports = ColorController;
