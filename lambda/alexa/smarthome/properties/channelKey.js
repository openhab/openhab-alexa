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

const { ItemType } = require('@openhab/constants');
const AlexaProperty = require('./property');

/**
 * Defines channel key property class
 * @extends AlexaProperty
 */
class ChannelKey extends AlexaProperty {
  /**
   * Defines channel key up
   * @type {String}
   */
  static UP = 'CHANNEL_UP';

  /**
   * Defines channel key down
   * @type {String}
   */
  static DOWN = 'CHANNEL_DOWN';

  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.STRING];
  }

  /**
   * Returns supported values
   * @return {Array}
   */
  get supportedValues() {
    return [ChannelKey.UP, ChannelKey.DOWN];
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return this.hasSupportedValuesMapped;
  }
}

module.exports = ChannelKey;
