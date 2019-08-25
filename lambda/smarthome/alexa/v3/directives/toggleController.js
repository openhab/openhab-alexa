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
    // Append instance name to interface name
    this.interface = 'ToggleController:' + directive.header.instance;
    this.map = {
      turnOn: 'setToggleState',
      turnOff: 'setToggleState'
    };
  }

  /**
   * Set toggle state
   */
  setToggleState() {
    const postItem = Object.assign({}, this.propertyMap[this.interface].toggleState.item, {
      state: this.directive.header.name === 'TurnOn' ? 'ON' : 'OFF'
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaToggleController;
