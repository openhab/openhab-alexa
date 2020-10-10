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
