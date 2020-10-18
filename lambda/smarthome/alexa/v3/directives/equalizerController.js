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

const log = require('@lib/log.js');
const AlexaDirective = require('../directive.js');
const { normalize } = require('../propertyState.js');

/**
 * Defines Alexa.EqualizerController interface directive class
 * @extends AlexaDirective
 */
class AlexaEqualizerController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'EqualizerController';
    this.map = {
      setBands: 'setBands',
      adjustBands: 'adjustBands',
      resetBands: 'setBands',
      setMode: 'setMode'
    };
  }

  /**
   * Set bands
   */
  setBands() {
    const properties = this.propertyMap.EqualizerController;
    const bandLevel = this.directive.payload.bands.reduce((values, band) =>
      Object.assign(values, {[`bands:${band.name.toLowerCase()}`]: band.level}), {});
    const postItems = Object.keys(properties).reduce((items, propertyName) =>
      items.concat(!bandLevel.hasOwnProperty(propertyName) ? [] :
        Object.assign({}, properties[propertyName].item, {
          state: bandLevel[propertyName] || properties[propertyName].parameters.default
        })
      ), []);
    log.debug('setBands to values:', {item: postItems});
    this.postItemsAndReturn(postItems);
  }

  /**
   * Adjust bands
   */
  adjustBands() {
    const properties = this.propertyMap.EqualizerController;
    const bandLevelDelta = this.directive.payload.bands.reduce((values, band) =>
      Object.assign(values, {[`bands:${band.name.toLowerCase()}`]:
        (band.levelDirection === 'UP' ? 1 : -1) * band.levelDelta || band.levelDirection}), {});
    const promises = Object.keys(properties).reduce((promises, propertyName) =>
      promises.concat(!bandLevelDelta.hasOwnProperty(propertyName) ? [] :
        this.getItemState(properties[propertyName].item).then((item) => {
          const increment = parseInt(properties[propertyName].parameters.increment);
          const minRange = properties[propertyName].parameters.range.minimum;
          const maxRange = properties[propertyName].parameters.range.maximum;
          let state;

          // Set state to increase/decrease for dimmer if level delta not provided in request and increment not defined,
          //  otherwise use either provided level delta, increment parameter or default delta of 1 to set adjusted state
          if (isNaN(bandLevelDelta[propertyName]) && isNaN(increment) && item.type === 'Dimmer') {
            state = bandLevelDelta[propertyName] === 'UP' ? 'INCREASE' : 'DECREASE';
          } else {
            state = parseInt(item.state) + (parseInt(bandLevelDelta[propertyName]) ||
              (bandLevelDelta[propertyName] === 'UP' ? 1 : -1) * (increment || 1));
            state = state < minRange ? minRange : state < maxRange ? state : maxRange;
          }

          return Object.assign({}, properties[propertyName].item, {state: state});
        })
      ), []);
    Promise.all(promises).then((postItems) => {
      log.debug('adjustBands to values:', {items: postItems});
      this.postItemsAndReturn(postItems);
    }).catch((error) => {
      this.returnAlexaGenericErrorResponse(error);
    });
  }

  /**
   * Set mode
   */
  setMode() {
    const properties = this.propertyMap.EqualizerController;
    const postItem = Object.assign({}, properties.mode.item, {
      state: normalize(properties.mode, this.directive.payload.mode)
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaEqualizerController;
