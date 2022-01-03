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

const AlexaProperty = require('./property');

/**
 * Defines connectivity property class
 * @extends AlexaProperty
 */
class Connectivity extends AlexaProperty {
  /**
   * Defines ok state
   * @type {String}
   */
  static OK = 'OK';

  /**
   * Defines unreachable state
   * @type {String}
   */
  static UNREACHABLE = 'UNREACHABLE';

  /**
   * Returns alexa state
   * @param  {Array} items
   * @return {Object}
   */
  getState(items) {
    // Determine endpoint health status based on every reportable item states being defined
    const isEndpointHealthy = items.every((item) => typeof item.state !== 'undefined');

    return { value: isEndpointHealthy ? Connectivity.OK : Connectivity.UNREACHABLE };
  }
}

module.exports = Connectivity;
