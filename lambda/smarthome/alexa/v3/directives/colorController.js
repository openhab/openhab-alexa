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

const AlexaDirective = require('../directive.js');

/**
 * Defines Alexa.ColorController interface directive class
 * @extends AlexaDirective
 */
class AlexaColorController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'ColorController';
    this.map = {
      setColor: 'setColor'
    };
  }

  /**
   * Set the color of a color item
   */
  setColor() {
    const hsb = [
      this.directive.payload.color.hue,
      this.directive.payload.color.saturation * 100.0,
      this.directive.payload.color.brightness * 100.0
    ];
    const postItem = Object.assign({}, this.propertyMap.ColorController.color.item, {
      state: hsb.join(',')
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaColorController;
