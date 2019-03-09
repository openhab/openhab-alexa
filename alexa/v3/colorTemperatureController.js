/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

const log = require('@lib/log.js');
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
    const postItem = Object.assign({}, properties.colorTemperatureInKelvin.item, {
      state: normalize(properties.colorTemperatureInKelvin, this.directive.payload.colorTemperatureInKelvin)
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust the color temperature
   */
  adjustColorTemperature() {
    const properties = this.propertyMap.ColorTemperatureController;
    const postItem = Object.assign({}, properties.colorTemperatureInKelvin.item);

    this.getItemState(postItem).then((item) => {
      // Generate error if in color mode (color controller property defined & empty state)
      if (this.propertyMap.ColorController && !parseInt(item.state)) {
        this.returnAlexaErrorResponse({
          namespace: this.directive.header.namespace,
          payload: {
            type: 'NOT_SUPPORTED_IN_CURRENT_MODE',
            message: 'The light is currently set to a color.',
            currentDeviceMode: 'COLOR'
          }
        });
        return;
      }
      // Throw error if state not a number
      if (isNaN(item.state)) {
        throw {reason: 'Could not get numeric item state', item: item};
      }

      const isIncreaseRequest = this.directive.header.name === 'IncreaseColorTemperature';
      const increment = parseInt(properties.colorTemperatureInKelvin.parameters.increment);
      let state;

      switch (item.type) {
        case 'Dimmer':
          // Send reverse command/value to OH since cold (0%) and warm (100%), depending if increment defined
          if (isNaN(increment)) {
            state = isIncreaseRequest ? 'DECREASE' : 'INCREASE';
          } else {
            state = parseInt(item.state) + (isIncreaseRequest ? -1 : 1) * increment;
            state = state < 0 ? 0 : state < 100 ? state : 100;
          }
          break;
        case 'Number':
          // Increment current state by defined value as Number doesn't support IncreaseDecreaseType commands
          state = parseInt(item.state) + (isIncreaseRequest ? 1 : -1) * (increment || 500);
          state = normalize(properties.colorTemperatureInKelvin, state);
          break;
      }

      postItem.state = state;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      log.error('adjustColorTemperature failed with error:', error);
      this.returnAlexaGenericErrorResponse();
    });
  }
}

module.exports = AlexaColorTemperatureController;
