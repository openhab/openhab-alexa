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
 * Defines Alexa.SecurityPanelController interface directive class
 * @extends AlexaDirective
 */
class AlexaSecurityPanelController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'SecurityPanelController';
    this.map = {
      arm: undefined,
      disarm: undefined
    };
  }
}

module.exports = AlexaSecurityPanelController;
