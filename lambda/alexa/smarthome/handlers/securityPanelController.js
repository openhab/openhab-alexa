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
const {
  InvalidValueError,
  SecurityPanelAuthorizationRequiredError,
  SecurityPanelBypassNeededError,
  SecurityPanelNotReadyError,
  SecurityPanelUnauthorizedError,
  SecurityPanelUnclearedAlarmError,
  SecurityPanelUnclearedTroubleError
} = require('../errors');
const { ArmState, AlertState } = require('../properties');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.SecurityPanelController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-securitypanelcontroller.html#directives
 * @extends AlexaHandler
 */
class SecurityPanelController extends AlexaHandler {
  /**
   * Defines arm directive
   * @type {String}
   */
  static ARM = 'Arm';

  /**
   * Defines disarm directive
   * @type {String}
   */
  static DISARM = 'Disarm';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_SECURITY_PANEL_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [SecurityPanelController.ARM]: this.arm,
      [SecurityPanelController.DISARM]: this.disarm
    };
  }

  /**
   * Arms security panel
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async arm(directive, openhab) {
    const properties = directive.endpoint.getCapabilityPropertyMap({ interface: directive.namespace });

    // Throw invalid value error if no security panel properties defined
    if (typeof properties === 'undefined') {
      throw new InvalidValueError('The security panel has no properties defined.');
    }

    const property = properties[Property.ARM_STATE];

    // Throw invalid value error if no arm state property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('The security panel has no arm state property.');
    }

    const { item, exitDelayInSeconds, supportedArmStates } = property;
    const armState = directive.payload.armState;

    // Throw invalid value error if requested arm state not supported
    if (!supportedArmStates.includes(armState)) {
      throw new InvalidValueError(`The security panel doesn't support ${armState} state.`);
    }

    // Get items current state for security arm and alert state properties
    const items = await Promise.all(
      Object.values(properties)
        .filter((property) => property instanceof ArmState || property instanceof AlertState)
        .map(({ item }) => openhab.getItemState(item.name).then((state) => ({ name: item.name, state })))
    );

    // Find property in alert state
    const alert = Object.values(properties)
      .filter((property) => property instanceof AlertState)
      .find((property) => {
        const item = items.find((item) => item.name === property.item.name);
        return property.getState(item.state) === AlertState.ALERT;
      });

    // Throw relevant security panel error based on alert name found
    if (alert) {
      // prettier-ignore
      switch (alert.name) {
        case Property.ZONES_ALERT:
          throw new SecurityPanelBypassNeededError(
            'Unable to arm the security panel because it has open zones that must be bypassed.'
          );
        case Property.READY_ALERT:
          throw new SecurityPanelNotReadyError(
            'Unable to arm the security panel because it is not ready.'
          );
        case Property.ALARM_ALERT:
          throw new SecurityPanelUnclearedAlarmError(
            'Unable to arm the security panel because it is in alarm status.'
          );
        case Property.TROUBLE_ALERT:
          throw new SecurityPanelUnclearedTroubleError(
            'Unable to arm the security panel because it is in trouble status.'
          );
      }
    }

    // Get current arm alexa state
    const updatedItem = items.find(({ name }) => name === item.name);
    const currentState = property.getState(updatedItem.state);

    // Throw authorization required error when currently in armed away state and request to arm stay or night
    if (currentState === ArmState.ARMED_AWAY && [ArmState.ARMED_STAY, ArmState.ARMED_NIGHT].includes(armState)) {
      throw new SecurityPanelAuthorizationRequiredError(
        'Unable to arm the security panel because it is currently in armed away mode.'
      );
    }

    const command = property.getCommand(armState);

    await openhab.sendCommand(item.name, command);

    return directive.response({
      namespace: directive.namespace,
      name: `${directive.name}.Response`,
      payload: { ...(armState === ArmState.ARMED_AWAY && !isNaN(exitDelayInSeconds) && { exitDelayInSeconds }) }
    });
  }

  /**
   * Disarms security panel
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async disarm(directive, openhab) {
    const properties = directive.endpoint.getCapabilityPropertyMap({ interface: directive.namespace });

    // Throw invalid value error if no security panel properties defined
    if (typeof properties === 'undefined') {
      throw new InvalidValueError('The security panel has no properties defined.');
    }

    const property = properties[Property.ARM_STATE];

    // Throw invalid value error if no arm state property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('The security panel has no arm state property.');
    }

    const { item, pinCodes } = property;
    const authorization = directive.payload.authorization || {};

    // Throw unauthorized error when provided pin code not valid
    if (authorization.type === ArmState.AuthType.FOUR_DIGIT_PIN && !pinCodes.includes(authorization.value)) {
      throw new SecurityPanelUnauthorizedError(
        'Unable to disarm the security panel because the PIN code is not correct.'
      );
    }

    // Get current ready alexa state if property defined
    const readyAlert = properties[Property.READY_ALERT];
    const readyState = await (readyAlert &&
      openhab.getItemState(readyAlert.item.name).then((state) => readyAlert.getState(state)));

    // Throw not ready error when in alert state
    if (readyState === AlertState.ALERT) {
      // prettier-ignore
      throw new SecurityPanelNotReadyError(
        'Unable to disarm the security panel because it is not ready.'
      );
    }

    const command = property.getCommand(ArmState.DISARMED);

    await openhab.sendCommand(item.name, command);

    return directive.response();
  }
}

module.exports = SecurityPanelController;
