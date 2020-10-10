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
 * Defines Alexa.LockController interface directive class
 * @extends AlexaDirective
 */
class AlexaLockController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'LockController';
    this.map = {
      lock: 'setLockState',
      unlock: 'setLockState'
    };
  }

  /**
   * Locks (ON) or unlocks (OFF) a item
   */
  setLockState() {
    const postItem = Object.assign({}, this.propertyMap.LockController.lockState.item, {
      state: this.directive.header.name === 'Lock' ? 'ON' : 'OFF'
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaLockController;
