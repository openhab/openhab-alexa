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

import { clamp } from '#root/utils.js';
import { ItemType, ItemValue } from '#openhab/constants.js';
import { Interface, Property } from '../constants.js';
import { CurrentModeColorError, EndpointUnreachableError, InvalidValueError, ValueOutOfRangeError } from '../errors.js';
import AlexaHandler from './handler.js';

/**
 * Defines Alexa.ColorTemperatureController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-colortemperaturecontroller.html#directives
 * @extends AlexaHandler
 */
export default class ColorTemperatureController extends AlexaHandler {
  /**
   * Defines set color temperature directive
   * @type {String}
   */
  static SET_COLOR_TEMPERATURE = 'SetColorTemperature';

  /**
   * Defines decrease color temperature directive
   * @type {String}
   */
  static DECREASE_COLOR_TEMPERATURE = 'DecreaseColorTemperature';

  /**
   * Defines increase color temperature directive
   * @type {String}
   */
  static INCREASE_COLOR_TEMPERATURE = 'IncreaseColorTemperature';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_COLOR_TEMPERATURE_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [ColorTemperatureController.SET_COLOR_TEMPERATURE]: this.setColorTemperature,
      [ColorTemperatureController.DECREASE_COLOR_TEMPERATURE]: this.adjustColorTemperature,
      [ColorTemperatureController.INCREASE_COLOR_TEMPERATURE]: this.adjustColorTemperature
    };
  }

  /**
   * Sets color temperature
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setColorTemperature(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.COLOR_TEMPERATURE
    });
    const { item, range: validRange } = property;
    const offset = 500; // offset to alleviate advertised manufacturer temperature discrepancies
    const temperature = directive.payload.colorTemperatureInKelvin;
    const command = property.getCommand(temperature);

    // Throw value out of range if provided temperature out of range
    if (temperature + offset < validRange[0] || temperature - offset > validRange[1]) {
      throw new ValueOutOfRangeError(`The color temperature cannot be set to ${temperature}K.`, { validRange });
    }

    await openhab.sendCommand(item.name, command);

    return directive.response();
  }

  /**
   * Adjusts color temperature
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustColorTemperature(directive, openhab) {
    const temperature = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.COLOR_TEMPERATURE
    });
    const color = directive.endpoint.getCapabilityProperty({
      interface: Interface.ALEXA_COLOR_CONTROLLER,
      property: Property.COLOR
    });

    // Throw invalid value error if temperature not retrievable
    if (!temperature.isRetrievable) {
      throw new InvalidValueError(`Cannot retrieve state for item ${temperature.item.name}.`);
    }

    // Get temperature and color item current state if retrievable
    const [temperatureState, colorState] = await Promise.all([
      openhab.getItemState(temperature.item.name),
      color?.isRetrievable && openhab.getItemState(color.item.name)
    ]);

    // Throw endpoint unreachable error if temperature state not a number
    if (isNaN(temperatureState)) {
      throw new EndpointUnreachableError(`Could not get numeric state for item ${temperature.item.name}.`);
    }

    // Throw current mode color error if in color mode
    if (temperature.isInColorMode(colorState, temperatureState)) {
      throw new CurrentModeColorError('The light is currently set to a color.');
    }

    const isIncreaseRequest = directive.name === ColorTemperatureController.INCREASE_COLOR_TEMPERATURE;
    const { increment, range } = temperature;
    let command;

    if (temperature.item.type === ItemType.DIMMER) {
      // Send reverse command/value to OH since cold (0%) and warm (100%), depending if increment defined
      command = !isNaN(increment)
        ? clamp(parseInt(temperatureState) + (isIncreaseRequest ? -1 : 1) * increment, 0, 100)
        : isIncreaseRequest
          ? ItemValue.DECREASE
          : ItemValue.INCREASE;
    } else {
      // Increment current state by defined value as Number doesn't support IncreaseDecreaseType commands
      command = clamp(
        parseInt(temperatureState) + (isIncreaseRequest ? 1 : -1) * (increment || 500),
        range[0],
        range[1]
      );
    }

    await openhab.sendCommand(temperature.item.name, command);

    return directive.response();
  }
}
