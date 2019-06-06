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
    const postItem = Object.assign({}, this.propertyMap.PowerLevelController.powerLevel.item, {
      state: this.directive.payload.powerLevel
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust power level
   */
  adjustPowerLevel() {
    const postItem = Object.assign({}, this.propertyMap.PowerLevelController.powerLevel.item);

    this.getItemState(postItem).then((item) => {
      // Throw error if state not a number
      if (isNaN(item.state)) {
        throw {cause: 'Could not get numeric item state', item: item};
      }

      const state = parseInt(item.state) + this.directive.payload.powerLevelDelta;
      postItem.state = state < 0 ? 0 : state < 100 ? state : 100;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      log.error('adjustPowerLevel failed with error:', error);
      this.returnAlexaGenericErrorResponse(error);
    });
  }
}

module.exports = AlexaPowerLevelController;
