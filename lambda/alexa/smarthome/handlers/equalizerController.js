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

const { clamp } = require('@root/utils');
const { ItemType, ItemValue } = require('@openhab/constants');
const { Interface, Property } = require('../constants');
const { EndpointUnreachableError, InvalidValueError } = require('../errors');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.EqualizerController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-equalizercontroller.html#directives
 * @extends AlexaHandler
 */
class EqualizerController extends AlexaHandler {
  /**
   * Defines set bands directive
   * @type {String}
   */
  static SET_BANDS = 'SetBands';

  /**
   * Defines adjust bands directive
   * @type {String}
   */
  static ADJUST_BANDS = 'AdjustBands';

  /**
   * Defines reset bands directive
   * @type {String}
   */
  static RESET_BANDS = 'ResetBands';

  /**
   * Defines set mode directive
   * @type {String}
   */
  static SET_MODE = 'SetMode';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_EQUALIZER_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [EqualizerController.SET_BANDS]: this.setBands,
      [EqualizerController.ADJUST_BANDS]: this.adjustBands,
      [EqualizerController.RESET_BANDS]: this.setBands,
      [EqualizerController.SET_MODE]: this.setMode
    };
  }

  /**
   * Sets equalizer bands
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setBands(directive, openhab) {
    const properties = directive.endpoint.getCapabilityComponentProperties({
      interface: directive.namespace,
      property: Property.EQUALIZER_BANDS
    });
    const commands = [];

    for (const { component, item, defaultLevel } of properties) {
      // Find band object in directive payload based on uppercase property component
      const band = directive.payload.bands.find((band) => band.name === component.toUpperCase());
      // Add command if property component match, using band level, if defined, fallback to default level parameter
      if (typeof band !== 'undefined') {
        commands.push(openhab.sendCommand(item.name, band.level || defaultLevel));
      }
    }

    await Promise.all(commands);

    return directive.response();
  }

  /**
   * Adjusts equalizer bands
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustBands(directive, openhab) {
    const properties = directive.endpoint.getCapabilityComponentProperties({
      interface: directive.namespace,
      property: Property.EQUALIZER_BANDS
    });
    const commands = [];

    for (const { component, item, increment, range, isRetrievable } of properties) {
      // Throw invalid value error if property not retrievable
      if (!isRetrievable) {
        throw new InvalidValueError(`Cannot retrieve state for item ${item.name}.`);
      }

      // Find band object in directive payload based on uppercase property component
      const band = directive.payload.bands.find((band) => band.name === component.toUpperCase());
      // Add command if property component match
      if (typeof band !== 'undefined') {
        commands.push(
          openhab.getItemState(item.name).then((state) => {
            const [minRange, maxRange] = range;
            let command;

            // Throw endpoint unreachable error if state not a number
            if (isNaN(state)) {
              throw new EndpointUnreachableError(`Could not get numeric state for item ${item.name}.`);
            }

            // Set band level to increase/decrease for dimmer if level delta not provided and increment not defined,
            //  otherwise use either provided level delta, increment value or default delta of 1
            if (!band.levelDelta && !increment && item.type === ItemType.DIMMER) {
              command = band.levelDirection === 'UP' ? ItemValue.INCREASE : ItemValue.DECREASE;
            } else {
              command = clamp(
                parseInt(state) + (band.levelDirection === 'UP' ? 1 : -1) * (band.levelDelta || increment || 1),
                minRange,
                maxRange
              );
            }

            return openhab.sendCommand(item.name, command);
          })
        );
      }
    }

    await Promise.all(commands);

    return directive.response();
  }

  /**
   * Sets equalizer mode
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setMode(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.EQUALIZER_MODE
    });
    const command = property.getCommand(directive.payload.mode);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }
}

module.exports = EqualizerController;
