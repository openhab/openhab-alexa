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

import AlexaCapability from './capability.js';
import { Capability, Interface } from '../constants.js';

/**
 * Defines Alexa.Networking.HomeNetworkController interface capability class
 *  https://developer.amazon.com/docs/networking/alexa-networking-homenetworkcontroller.html
 * @extends AlexaCapability
 */
export default class NetworkingHomeNetworkController extends AlexaCapability {
  /**
   * Returns name
   * @return {String}
   */
  static get name() {
    return Capability.NETWORKING_HOME_NETWORK_CONTROLLER;
  }

  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_NETWORKING_HOME_NETWORK_CONTROLLER;
  }
}
