/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

const utils = require('@lib/utils.js');
const AlexaDirective = require('../directive.js');

/**
 * Defines Alexa.SceneController interface directive class
 * @extends AlexaDirective
 */
class AlexaSceneController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'SceneController';
    this.map = {
      activate: 'setScene',
      deactivate: 'setScene'
    };
  }

  /**
   * Sends a send name to a string item
   */
  setScene() {
    const isSceneActivate = this.directive.header.name === 'Activate';
    const postItem = Object.assign(this.propertyMap.SceneController.scene.item, {
      state: isSceneActivate ? 'ON' : 'OFF'
    });
    const response = this.generateResponse({
      header: {
        namespace: this.directive.header.namespace,
        name: isSceneActivate ? 'ActivationStarted' : 'DeactivationStarted'
      },
      payload: {
        cause: {
          type: 'VOICE_INTERACTION'
        },
        timestamp: utils.date()
      }
    });
    this.postItemsAndReturn([postItem], {response: response});
  }
}

module.exports = AlexaSceneController;
