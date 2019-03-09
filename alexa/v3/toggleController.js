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
 * Defines Alexa.ToggleController interface directive class
 * @extends AlexaDirective
 */
class AlexaToggleController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'ToggleController';
    this.map = {
      turnOn: 'setToggleState',
      turnOff: 'setToggleState'
    };
  }

  /**
   * Set toggle state
   */
  setToggleState() {
    // Append instance name to interface property
    this.interface += ':' + this.directive.header.instance;
    const postItem = Object.assign(this.propertyMap[this.interface].toggleState.item, {
      state: this.directive.header.name === 'TurnOn' ? 'ON' : 'OFF'
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaToggleController;
