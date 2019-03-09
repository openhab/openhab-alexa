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
    const postItem = Object.assign(this.propertyMap.PercentageController.percentage.item, {
      state: this.directive.payload.percentage
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust percentage
   */
  adjustPercentage() {
    const postItem = this.propertyMap.PercentageController.percentage.item;

    this.getItemState(postItem).then((item) => {
      // Throw error if state not a number
      if (isNaN(item.state)) {
        throw {reason: 'Could not get numeric item state', item: item};
      }

      const state = parseInt(item.state) + this.directive.payload.percentageDelta;
      postItem.state = state < 0 ? 0 : state < 100 ? state : 100;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      log.error('adjustPercentage failed with error:', error);
      this.returnAlexaGenericErrorResponse();
    });
  }
}

module.exports = AlexaPercentageController;
