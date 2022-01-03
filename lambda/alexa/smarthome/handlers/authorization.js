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

const { Interface } = require('../constants');
const { AuthorizationAcceptGrantError } = require('../errors');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.Authorization interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-authorization.html#directives
 * @extends AlexaHandler
 */
class Authorization extends AlexaHandler {
  /**
   * Defines accept grant directive
   * @type {String}
   */
  static ACCEPT_GRANT = 'AcceptGrant';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_AUTHORIZATION;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [Authorization.ACCEPT_GRANT]: this.acceptGrant
    };
  }

  /**
   * Grants authorization
   * @return {Promise}
   */
  static async acceptGrant() {
    // Not supported currently
    throw new AuthorizationAcceptGrantError('Not supported');
  }
}

module.exports = Authorization;
