/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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

const { isInColorMode } = require('../capabilities.js');
const AlexaDirective = require('../directive.js');
const { normalize } = require('../propertyState.js');

/**
 * Defines Alexa.ColorTemperatureController interface directive class
 * @extends AlexaDirective
 */
class AlexaColorTemperatureController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'ColorTemperatureController';
    this.map = {
      setColorTemperature: 'setColorTemperature',
      decreaseColorTemperature: 'adjustColorTemperature',
      increaseColorTemperature: 'adjustColorTemperature'
    };
  }

  /**
   * Set color temperature
   */
  setColorTemperature() {
    const properties = this.propertyMap.ColorTemperatureController;
    const range = properties.colorTemperatureInKelvin.parameters.range || [];
    const offset = 500; // offset to alleviate advertised manufacturer temperature discrepancies
    const temperature = this.directive.payload.colorTemperatureInKelvin;
    const postItem = Object.assign({}, properties.colorTemperatureInKelvin.item, {
      state: normalize(properties.colorTemperatureInKelvin, temperature)
    });

    if (range.length !== 2 || temperature >= range[0] - offset && temperature <= range[1] + offset) {
      this.postItemsAndReturn([postItem]);
    } else {
      this.returnAlexaErrorResponse({
        payload: {
          type: 'VALUE_OUT_OF_RANGE',
          message: `The color temperature cannot be set to ${temperature}K.`,
          validRange: {
            minimumValue: range[0],
            maximumValue: range[1]
          }
        }
      });
    }
  }

  /**
   * Adjust the color temperature
   */
  adjustColorTemperature() {
    const properties = this.propertyMap.ColorTemperatureController;
    const postItem = Object.assign({}, properties.colorTemperatureInKelvin.item);
    const promises = [].concat(this.getItemState(postItem),
      this.propertyMap.ColorController ? this.getItemState(this.propertyMap.ColorController.color.item) : []);

    Promise.all(promises).then((items) => {
      const [temperatureItem, colorItem] = items;
      const binding = properties.colorTemperatureInKelvin.parameters.binding;

      // Generate error if in color mode
      if (isInColorMode(colorItem, temperatureItem, binding)) {
        this.returnAlexaErrorResponse({
          payload: {
            type: 'NOT_SUPPORTED_IN_CURRENT_MODE',
            message: 'The light is currently set to a color.',
            currentDeviceMode: 'COLOR'
          }
        });
        return;
      }
      // Throw error if state not a number
      if (isNaN(temperatureItem.state)) {
        throw {cause: 'Could not get numeric item state', item: temperatureItem};
      }

      const isIncreaseRequest = this.directive.header.name === 'IncreaseColorTemperature';
      const increment = parseInt(properties.colorTemperatureInKelvin.parameters.increment);
      let state;

      switch (temperatureItem.type) {
        case 'Dimmer':
          // Send reverse command/value to OH since cold (0%) and warm (100%), depending if increment defined
          if (isNaN(increment)) {
            state = isIncreaseRequest ? 'DECREASE' : 'INCREASE';
          } else {
            state = parseInt(temperatureItem.state) + (isIncreaseRequest ? -1 : 1) * increment;
            state = state < 0 ? 0 : state < 100 ? state : 100;
          }
          break;
        case 'Number':
          // Increment current state by defined value as Number doesn't support IncreaseDecreaseType commands
          state = parseInt(temperatureItem.state) + (isIncreaseRequest ? 1 : -1) * (increment || 500);
          state = normalize(properties.colorTemperatureInKelvin, state);
          break;
      }

      postItem.state = state;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      this.returnAlexaGenericErrorResponse(error);
    });
  }
}

module.exports = AlexaColorTemperatureController;
