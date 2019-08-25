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

const AlexaDirective = require('../directive.js');

/**
 * Defines Alexa.InputController interface directive class
 * @extends AlexaDirective
 */
class AlexaInputController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'InputController';
    this.map = {
      selectInput: 'selectInput'
    };
  }

  /**
   * Select input (HDMI1, Music, etc..)
   */
  selectInput() {
    const postItem = Object.assign({}, this.propertyMap.InputController.input.item, {
      state: this.directive.payload.input.replace(/\s/g, '').toUpperCase()
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaInputController;
