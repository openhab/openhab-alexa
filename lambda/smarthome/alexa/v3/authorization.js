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
