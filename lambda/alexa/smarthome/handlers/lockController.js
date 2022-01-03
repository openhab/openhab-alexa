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
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.LockController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-lockcontroller.html#directives
 * @extends AlexaHandler
 */
class LockController extends AlexaHandler {
  /**
   * Defines lock directive
   * @type {String}
   */
  static LOCK = 'Lock';

  /**
   * Defines unlock directive
   * @type {String}
   */
  static UNLOCK = 'Unlock';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_LOCK_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [LockController.LOCK]: this.setLockState,
      [LockController.UNLOCK]: this.setLockState
    };
  }

  /**
   * Sets lock state
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setLockState(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.LOCK_STATE
    });
    const command = property.getCommand(directive.name === LockController.LOCK ? ItemValue.ON : ItemValue.OFF);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }
}

module.exports = LockController;
