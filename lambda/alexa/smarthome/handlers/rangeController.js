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
 * Defines Alexa.RangeController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-rangecontroller.html#directives
 * @extends AlexaHandler
 */
class RangeController extends AlexaHandler {
  /**
   * Defines set range value directive
   * @type {String}
   */
  static SET_RANGE_VALUE = 'SetRangeValue';

  /**
   * Defines adjust range value directive
   * @type {String}
   */
  static ADJUST_RANGE_VALUE = 'AdjustRangeValue';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_RANGE_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [RangeController.SET_RANGE_VALUE]: this.setRangeValue,
      [RangeController.ADJUST_RANGE_VALUE]: this.adjustRangeValue
    };
  }

  /**
   * Sets range value
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setRangeValue(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      instance: directive.instance,
      property: Property.RANGE_VALUE
    });
    const command = property.getCommand(directive.payload.rangeValue);

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }

  /**
   * Adjusts range value
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustRangeValue(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      instance: directive.instance,
      property: Property.RANGE_VALUE
    });
    const { item, supportedRange, isRetrievable } = property;

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

    // Determine command adding directive payload delta value to current state
    const [minRange, maxRange] = supportedRange;
    const command = clamp(
      parseInt(state) + property.getCommand(directive.payload.rangeValueDelta, { isDelta: true }),
      minRange,
      maxRange
    );

    await openhab.sendCommand(item.name, command);

    return directive.response();
  }
}

module.exports = RangeController;
