/**
 * Copyright (c) 2010-2023 Contributors to the openHAB project
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

import AlexaProperty from './property.js';

/**
 * Defines decouple state property class
 * @extends AlexaProperty
 */
export default class DecoupleState extends AlexaProperty {
  /**
   * Defines sensor tag name
   * @type {String}
   */
  static TAG_SENSOR = 'sensor';

  /**
   * Returns supported tags
   * @return {Array}
   */
  get supportedTags() {
    return [DecoupleState.TAG_SENSOR];
  }

  /**
   * Returns required linked properties
   * @return {Array}
   */
  get requiredLinkedProperties() {
    // Requires untagged property (target) to be linked
    return [{ name: this.name, component: this.component, tag: undefined }];
  }
}
