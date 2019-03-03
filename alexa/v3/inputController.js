/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
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
    const postItem = Object.assign(this.propertyMap.InputController.input.item, {
      state: this.directive.payload.input.replace(/\s/g, '').toUpperCase()
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaInputController;
