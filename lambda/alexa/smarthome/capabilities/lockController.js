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

import AlexaCapability from './capability.js';
import AlexaDisplayCategory from '../category.js';
import { Capability, Interface, Property } from '../constants.js';
import { LockState } from '../properties/index.js';

/**
 * Defines Alexa.LockController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-lockcontroller.html
 * @extends AlexaCapability
 */
export default class LockController extends AlexaCapability {
  /**
   * Returns name
   * @return {String}
   */
  static get name() {
    return Capability.LOCK_CONTROLLER;
  }

  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_LOCK_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.LOCK_STATE]: LockState
    };
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return [AlexaDisplayCategory.SMARTLOCK];
  }
}
