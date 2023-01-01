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

import { ItemType } from '#openhab/constants.js';
import { Parameter, ParameterType } from '../metadata.js';
import AlexaProperty from './property.js';

/**
 * Defines volume level property class
 * @extends AlexaProperty
 */
export default class VolumeLevel extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.DIMMER, ItemType.NUMBER];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.INCREMENT]: ParameterType.INTEGER
    };
  }

  /**
   * Returns increment based on parameter
   * @return {Number}
   */
  get increment() {
    return this.parameters[Parameter.INCREMENT];
  }

  /**
   * Returns alexa state
   * @param  {String} value
   * @return {Number}
   */
  getState(value) {
    // Return state if numerical value
    if (!isNaN(value)) {
      return parseInt(value);
    }
  }
}
