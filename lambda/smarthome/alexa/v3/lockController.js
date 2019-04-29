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
    const properties = this.propertyMap.LockController;
    const postItem = Object.assign({}, properties.lockState.item, {
      state: this.directive.header.name.toUpperCase() === 'LOCK' ? 'ON' : 'OFF'
    });
    this.postItemsAndReturn([postItem]);
  }
}

module.exports = AlexaLockController;
