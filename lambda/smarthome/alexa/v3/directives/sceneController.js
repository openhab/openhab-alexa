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
   * Set scene
   */
  setScene() {
    const postItem = Object.assign({}, this.propertyMap.SceneController.scene.item, {
      state: this.directive.header.name === 'Activate' ? 'ON' : 'OFF'
    });
    this.postItemsAndReturn([postItem], {
      header: {
        namespace: this.directive.header.namespace,
        name: this.directive.header.name === 'Activate' ? 'ActivationStarted' : 'DeactivationStarted'
      },
      payload: {
        cause: {
          type: 'VOICE_INTERACTION'
        },
        timestamp: utils.date()
      }
    });
  }
}

module.exports = AlexaSceneController;
