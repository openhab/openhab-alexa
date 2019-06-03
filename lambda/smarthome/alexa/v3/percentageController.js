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
 * Defines Alexa.PercentageController interface directive class
 * @extends AlexaDirective
 */
class AlexaPercentageController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'PercentageController';
    this.map = {
      setPercentage: 'setPercentage',
      adjustPercentage: 'adjustPercentage'
    };
  }

  /**
   * Set percentage
   */
  setPercentage() {
    const postItem = Object.assign({}, this.propertyMap.PercentageController.percentage.item, {
      state: this.directive.payload.percentage
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust percentage
   */
  adjustPercentage() {
    const postItem = Object.assign({}, this.propertyMap.PercentageController.percentage.item);

    this.getItemState(postItem).then((item) => {
      // Throw error if state not a number
      if (isNaN(item.state)) {
        throw {cause: 'Could not get numeric item state', item: item};
      }

      const state = parseInt(item.state) + this.directive.payload.percentageDelta;
      postItem.state = state < 0 ? 0 : state < 100 ? state : 100;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      log.error('adjustPercentage failed with error:', error);
      this.returnAlexaGenericErrorResponse(error);
    });
  }
}

module.exports = AlexaPercentageController;
