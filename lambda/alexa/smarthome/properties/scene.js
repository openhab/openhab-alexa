/**
 * Copyright (c) 2010-2025 Contributors to the openHAB project
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

import { ItemType } from '#openhab/constants.js';
import { Parameter, ParameterType } from '../constants.js';
import AlexaProperty from './property.js';

/**
 * Defines scene property class
 * @extends AlexaProperty
 */
export default class Scene extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.SWITCH];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.SUPPORTS_DEACTIVATION]: ParameterType.BOOLEAN
    };
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }

  /**
   * Returns supports deactivation based on parameter
   * @return {Boolean}
   */
  get supportsDeactivation() {
    return this.parameters[Parameter.SUPPORTS_DEACTIVATION] !== false;
  }
}
