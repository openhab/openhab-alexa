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

const AlexaCapability = require('./capability');
const AlexaDisplayCategory = require('../category');
const { Interface, Property } = require('../constants');
const { ArmState, AlarmState, SecurityAlert } = require('../properties');

/**
 * Defines Alexa.SecurityPanelController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-securitypanelcontroller.html
 * @extends AlexaCapability
 */
class SecurityPanelController extends AlexaCapability {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_SECURITY_PANEL_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.ARM_STATE]: ArmState,
      [Property.BURGLARY_ALARM]: AlarmState,
      [Property.CARBON_MONOXIDE_ALARM]: AlarmState,
      [Property.FIRE_ALARM]: AlarmState,
      [Property.WATER_ALARM]: AlarmState,
      [Property.ALARM_ALERT]: SecurityAlert,
      [Property.READY_ALERT]: SecurityAlert,
      [Property.TROUBLE_ALERT]: SecurityAlert,
      [Property.ZONES_ALERT]: SecurityAlert
    };
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return [AlexaDisplayCategory.SECURITY_PANEL];
  }

  /**
   * Returns capability configuration
   * @return {Object}
   */
  getCapabilityConfiguration() {
    const configuration = {};
    const armState = this.getProperty({ name: Property.ARM_STATE });

    if (armState) {
      const { supportedArmStates, pinCodes } = armState;

      configuration.supportedArmStates = supportedArmStates.map((state) => ({ value: state }));

      if (pinCodes.length > 0) {
        configuration.supportedAuthorizationTypes = [{ type: ArmState.AuthType.FOUR_DIGIT_PIN }];
      }
    }

    return configuration;
  }
}

module.exports = SecurityPanelController;
