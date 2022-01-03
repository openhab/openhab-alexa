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

const { clamp } = require('@root/utils');
const { Interface, Property } = require('../constants');
const { EndpointUnreachableError, InvalidValueError } = require('../errors');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.PercentageController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-percentagecontroller.html#directives
 * @extends AlexaHandler
 */
class PercentageController extends AlexaHandler {
  /**
   * Defines set percentage directive
   * @type {String}
   */
  static SET_PERCENTAGE = 'SetPercentage';

  /**
   * Defines adjust percentage directive
   * @type {String}
   */
  static ADJUST_PERCENTAGE = 'AdjustPercentage';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_PERCENTAGE_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [PercentageController.SET_PERCENTAGE]: this.setPercentage,
      [PercentageController.ADJUST_PERCENTAGE]: this.adjustPercentage
    };
  }

  /**
   * Sets percentage
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setPercentage(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.PERCENTAGE
    });
    const command = property.getCommand(directive.payload.percentage);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }

  /**
   * Adjusts percentage
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustPercentage(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.PERCENTAGE
    });
    const { item, isRetrievable } = property;

    // Throw invalid value error if property not retrievable
    if (!isRetrievable) {
      throw new InvalidValueError(`Cannot retrieve state for item ${item.name}.`);
    }

    // Get item current state
    const state = await openhab.getItemState(item.name);

    // Throw endpoint unreachable error if state not a number
    if (isNaN(state)) {
      throw new EndpointUnreachableError(`Could not get numeric state for item ${item.name}.`);
    }

    // Determine adjusted percentage adding directive payload delta value to current state
    const percentage = clamp(
      parseInt(state) + property.getCommand(directive.payload.percentageDelta, { isDelta: true }),
      0,
      100
    );

    await openhab.sendCommand(item.name, percentage);

    return directive.response();
  }
}

module.exports = PercentageController;
