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
 * Defines Alexa.RangeController interface directive class
 * @extends AlexaDirective
 */
class AlexaRangeController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    // Append instance name to interface name
    this.interface = 'RangeController:' + directive.header.instance;
    this.map = {
      setRangeValue: 'setRangeValue',
      adjustRangeValue: 'adjustRangeValue'
    };
  }

  /**
   * Set range value
   */
  setRangeValue() {
    const postItem = Object.assign({}, this.propertyMap[this.interface].rangeValue.item, {
      state: this.directive.payload.rangeValue
    });
    this.postItemsAndReturn([postItem]);
  }

  /**
   * Adjust range value
   */
  adjustRangeValue() {
    const properties = this.propertyMap[this.interface]
    const postItem = Object.assign({}, properties.rangeValue.item);

    this.getItemState(postItem).then((item) => {
      // Throw error if state not a number
      if (isNaN(item.state)) {
        throw {cause: 'Could not get numeric item state', item: item};
      }

      const minRange = properties.rangeValue.parameters.supportedRange.minimumValue;
      const maxRange = properties.rangeValue.parameters.supportedRange.maximumValue;
      const state = parseInt(item.state) + this.directive.payload.rangeValueDelta;
      postItem.state = state < minRange ? minRange : state < maxRange ? state : maxRange;
      this.postItemsAndReturn([postItem]);
    }).catch((error) => {
      log.error('adjustRangeValue failed with error:', error);
      this.returnAlexaGenericErrorResponse(error);
    });
  }
}

module.exports = AlexaRangeController;
