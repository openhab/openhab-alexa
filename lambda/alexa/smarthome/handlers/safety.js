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

const { Interface, Property } = require('../constants');
const { SafetyObstacleDetectedError } = require('../errors');
const { AlertState } = require('../properties');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.Safety interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-safety-errorresponse.html
 * @extends AlexaHandler
 */
class Safety extends AlexaHandler {
  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_SAFETY;
  }

  /**
   * Checks alerts
   * @param  {Object} directive
   * @param  {Object} openhab
   */
  static async checkAlerts(directive, openhab) {
    const properties = directive.endpoint.getCapabilityPropertyMap({ interface: Interface.ALEXA_SAFETY }) || {};

    // Get items current state for safety alert state properties
    const items = await Promise.all(
      Object.values(properties)
        .filter((property) => property instanceof AlertState)
        .map(({ item }) => openhab.getItemState(item.name).then((state) => ({ name: item.name, state })))
    );

    // Find property in alert state
    const alert = Object.values(properties)
      .filter((property) => property instanceof AlertState)
      .find((property) => {
        const item = items.find((item) => item.name === property.item.name);
        return property.getState(item.state) === AlertState.ALERT;
      });

    // Throw relevant safety error based on alert name found
    if (alert) {
      switch (alert.name) {
        case Property.OBSTACLE_ALERT:
          throw new SafetyObstacleDetectedError('Unable to close door because an obstacle is detected.');
      }
    }
  }
}

module.exports = Safety;
