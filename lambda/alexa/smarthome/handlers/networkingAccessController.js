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

const { Interface, Property } = require('../constants');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.Networking.AccessController interface handler class
 *  https://developer.amazon.com/docs/networking/alexa-networking-accesscontroller.html#directives
 * @extends AlexaHandler
 */
class NetworkingAccessController extends AlexaHandler {
  /**
   * Defines set network access directive
   * @type {String}
   */
  static SET_NETWORK_ACCESS = 'SetNetworkAccess';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_NETWORKING_ACCESS_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [NetworkingAccessController.SET_NETWORK_ACCESS]: this.setNetworkAccess
    };
  }

  /**
   * Sets network access
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setNetworkAccess(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.NETWORK_ACCESS
    });
    const command = property.getCommand(directive.payload.networkAccess);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }
}

module.exports = NetworkingAccessController;
