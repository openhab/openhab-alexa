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
 * Defines Alexa.Authorization interface directive class
 * @extends AlexaDirective
 */
class AlexaAuthorization extends AlexaDirective {
  /**
   * Grant authorization
   */
  acceptGrant() {
    // Not supported currently
    this.returnAlexaErrorResponse({
      namespace: this.directive.header.namespace,
      payload: {
        type: 'ACCEPT_GRANT_FAILED',
        message: 'Not supported'
      }
    });
  }
}

module.exports = AlexaAuthorization;
