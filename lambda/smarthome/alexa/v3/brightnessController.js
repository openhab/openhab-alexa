/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
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

const log = require('@lib/log.js');
const AlexaDirective = require('../directive.js');

/**
 * Defines Alexa.BrightnessController interface directive class
 * @extends AlexaDirective
 */
class AlexaBrightnessController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'BrightnessController';
    this.map = {
      setBrightness: 'setBrightness',
      adjustBrightness: 'adjustBrightness'
    };
  }

  /**
   * Set brightness
   */
  setBrightness() {
    const postItem = Object.assign({}, this.propertyMap.BrightnessController.brightness.item, {
      state: this.directive.payload.brightness
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust brightness
   */
  adjustBrightness() {
    const postItem = Object.assign({}, this.propertyMap.BrightnessController.brightness.item);

    this.getItemState(postItem).then((item) => {
      // Throw error if state not a number
      if (isNaN(item.state)) {
        throw {cause: 'Could not get numeric item state', item: item};
      }

      const state = parseInt(item.state) + this.directive.payload.brightnessDelta;
      postItem.state = state < 0 ? 0 : state < 100 ? state : 100;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      log.error('adjustBrightness failed with error:', error);
      this.returnAlexaGenericErrorResponse(error);
    });
  }
}

module.exports = AlexaBrightnessController;
