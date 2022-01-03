/**
 * Copyright (c) 2010-2022 Contributors to the openHAB project
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

const { ItemValue } = require('@openhab/constants');
const { Interface, Property } = require('../constants');
const { CauseType } = require('./alexa');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.SceneController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-scenecontroller.html#directives
 * @extends AlexaHandler
 */
class SceneController extends AlexaHandler {
  /**
   * Defines activate directive
   * @type {String}
   */
  static ACTIVATE = 'Activate';

  /**
   * Defines deactivate directive
   * @type {String}
   */
  static DEACTIVATE = 'Deactivate';

  /**
   * Defines activation started response
   * @type {String}
   */
  static ACTIVATION_STARTED = 'ActivationStarted';

  /**
   * Defines deactivation started response
   * @type {String}
   */
  static DEACTIVATION_STARTED = 'DeactivationStarted';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_SCENE_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [SceneController.ACTIVATE]: this.setScene,
      [SceneController.DEACTIVATE]: this.setScene
    };
  }

  /**
   * Sets scene
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setScene(directive, openhab) {
    const { item } = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.SCENE
    });
    const command = directive.name === SceneController.ACTIVATE ? ItemValue.ON : ItemValue.OFF;

    await openhab.sendCommand(item.name, command);

    return directive.response({
      namespace: directive.namespace,
      name:
        directive.name === SceneController.ACTIVATE
          ? SceneController.ACTIVATION_STARTED
          : SceneController.DEACTIVATION_STARTED,
      payload: { cause: { type: CauseType.VOICE_INTERACTION }, timestamp: new Date().toISOString() }
    });
  }
}

module.exports = SceneController;
