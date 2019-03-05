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
 * Defines Alexa.PowerLevelController interface directive class
 * @extends AlexaDirective
 */
class AlexaPowerLevelController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'PowerLevelController';
    this.map = {
      setPowerLevel: 'setPowerLevel',
      adjustPowerLevel: 'adjustPowerLevel'
    };
  }

  /**
   * Set power level
   */
  setPowerLevel() {
    const postItem = Object.assign(this.propertyMap.PowerLevelController.powerLevel.item, {
      state: this.directive.payload.powerLevel
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust power level
   */
  adjustPowerLevel() {
    const postItem = this.propertyMap.PowerLevelController.powerLevel.item;

    this.getItemState(postItem).then((item) => {
      // Throw error if state not a number
      if (isNaN(item.state)) {
        throw {reason: 'Could not get numeric item state', item: item};
      }

      const state = parseInt(item.state) + this.directive.payload.powerLevelDelta;
      postItem.state = state < 0 ? 0 : state < 100 ? state : 100;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      log.error('adjustPowerLevel failed with error:', error);
      this.returnAlexaGenericErrorResponse();
    });
  }
}

module.exports = AlexaPowerLevelController;
