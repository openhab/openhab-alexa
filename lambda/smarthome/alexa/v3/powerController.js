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
 * Defines Alexa.PowerController interface directive class
 * @extends AlexaDirective
 */
class AlexaPowerController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'PowerController';
    this.map = {
      turnOn: 'setPowerState',
      turnOff: 'setPowerState'
    };
  }

  /**
   * Turns a Switch ON or OFF
   */
  setPowerState () {
    const postItem = Object.assign({}, this.propertyMap.PowerController.powerState.item, {
      state: this.directive.header.name === 'TurnOn' ? 'ON' : 'OFF'
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaPowerController;
