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

const { clamp, decamelize } = require('@root/utils');
const { Interface, Property } = require('../constants');
const {
  EndpointUnreachableError,
  InvalidValueError,
  TemperatureOutOfRangeError,
  ThermostatModeUnsupportedError,
  ThermostatOffError,
  ThermostatScheduleRequestError,
  ThermostatSetpointsTooCloseError,
  ThermostatSetpointsUnsupportedError
} = require('../errors');
const { ThermostatMode, ThermostatHold } = require('../properties');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.ThermostatController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-thermostatcontroller.html#directives
 * @extends AlexaHandler
 */
class ThermostatController extends AlexaHandler {
  /**
   * Defines set target temperature directive
   * @type {String}
   */
  static SET_TARGET_TEMPERATURE = 'SetTargetTemperature';

  /**
   * Defines adjust target temperature directive
   * @type {String}
   */
  static ADJUST_TARGET_TEMPERATURE = 'AdjustTargetTemperature';

  /**
   * Defines set thermostat mode directive
   * @type {String}
   */
  static SET_THERMOSTAT_MODE = 'SetThermostatMode';

  /**
   * Defines resume schedule directive
   * @type {String}
   */
  static RESUME_SCHEDULE = 'ResumeSchedule';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_THERMOSTAT_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [ThermostatController.SET_TARGET_TEMPERATURE]: this.setTargetTemperature,
      [ThermostatController.ADJUST_TARGET_TEMPERATURE]: this.adjustTargetTemperature,
      [ThermostatController.SET_THERMOSTAT_MODE]: this.setThermostatMode,
      [ThermostatController.RESUME_SCHEDULE]: this.resumeSchedule
    };
  }

  /**
   * Sets the target temperature
   *  this can include upper, lower and target setpoints in the same request
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setTargetTemperature(directive, openhab) {
    const capability = directive.endpoint.getCapability({ interface: directive.namespace });

    // Throw invalid value error if no thermostat capability defined
    if (typeof capability === 'undefined') {
      throw new InvalidValueError('The thermostat has no capability defined.');
    }

    const properties = capability.getPropertyMap();
    const thermostatHold = properties[Property.THERMOSTAT_HOLD];
    const thermostatMode = properties[Property.THERMOSTAT_MODE];

    // Throw schedule request error if schedule request
    if (directive.payload.schedule) {
      throw new ThermostatScheduleRequestError('Thermostat schedule request not supported.');
    }

    // Get current alexa thermostat mode if property defined, retrievable and supports setpoint mode
    const mode =
      thermostatMode && thermostatMode.isRetrievable && thermostatMode.supportsSetpointMode !== false
        ? await openhab.getItemState(thermostatMode.item.name).then((state) => thermostatMode.getState(state))
        : undefined;

    // Throw thermostat off error if mode is off
    if (mode === ThermostatMode.OFF) {
      throw new ThermostatOffError('The thermostat is off.');
    }

    // Determine request properties based on directive payload setpoint-named properties
    const requestProperties = Object.keys(directive.payload).filter((name) => name.endsWith('Setpoint'));
    // Determine setpoint properties based on thermostat mode
    const setpointProperties = capability.getSetpointProperties(mode, properties);

    // Throw invalid value error if no setpoint properties defined
    if (Object.keys(setpointProperties).length === 0) {
      throw new InvalidValueError('The thermostat has no setpoint properties.');
    }

    // Throw thermostat setpoints unsupported error if thermostat not currently in dual/triple mode while request is
    if (requestProperties.length > Object.keys(setpointProperties).length) {
      const setpointMode = requestProperties.length === 2 ? 'dual' : 'triple';
      throw new ThermostatSetpointsUnsupportedError(
        `The thermostat doesn't support ${setpointMode} setpoints in the current mode.`,
        { setpointMode }
      );
    }

    // Determine items to update based on request properties
    const items = requestProperties
      .filter((name) => setpointProperties[name])
      .map((name) => ({
        name: setpointProperties[name].item.name,
        command: setpointProperties[name].getCommand(directive.payload[name]),
        property: setpointProperties[name]
      }));
    // Extract setpoints based on setpoint properties mappings
    const { targetSetpoint, upperSetpoint, lowerSetpoint } = setpointProperties;

    if (upperSetpoint && lowerSetpoint) {
      // Throw thermostat setpoints too close error if requested setpoints too close in dual/triple mode
      if (directive.payload.upperSetpoint && directive.payload.lowerSetpoint) {
        // Determine minimum temperature setpoint delta by adding upper and lower comfort range
        const minimumTemperatureDelta = upperSetpoint.comfortRange + lowerSetpoint.comfortRange;
        // Determine request temperature setpoint delta by subtracting upper to lower directive command setpoints
        const requestTemperatureDelta =
          upperSetpoint.getCommand(directive.payload.upperSetpoint) -
          lowerSetpoint.getCommand(directive.payload.lowerSetpoint);

        if (minimumTemperatureDelta > requestTemperatureDelta) {
          throw new ThermostatSetpointsTooCloseError('The temperature setpoints are too close together.', {
            minimumTemperatureDelta,
            scale: upperSetpoint.scale
          });
        }
      }

      // Add upper/lower setpoints items using comfort range if request has target setpoint and property not defined
      if (directive.payload.targetSetpoint && !targetSetpoint) {
        items.push(
          {
            name: upperSetpoint.item.name,
            command: upperSetpoint.getCommand(directive.payload.targetSetpoint) + upperSetpoint.comfortRange,
            property: upperSetpoint
          },
          {
            name: lowerSetpoint.item.name,
            command: lowerSetpoint.getCommand(directive.payload.targetSetpoint) - lowerSetpoint.comfortRange,
            property: lowerSetpoint
          }
        );
      }
    }

    // Throw temperature out of range error if one of the setpoint temperatures is out of range
    for (const { command, property } of items) {
      const { name, scale, setpointRange: validRange } = property;

      if (command < validRange[0] || command > validRange[1]) {
        throw new TemperatureOutOfRangeError(
          `The ${decamelize(name, ' ')} temperature cannot be set to ${command}°${scale.charAt(0)}.`,
          { validRange, scale }
        );
      }
    }

    // Set thermostat hold prior to sending setpoint commands if required
    if (thermostatHold && thermostatHold.requiresSetpointHold) {
      await openhab.sendCommand(thermostatHold.item.name, thermostatHold.getCommand(ThermostatHold.ON));
    }

    // Define commands to send
    const commands = items.map((item) => openhab.sendCommand(item.name, item.command));

    await Promise.all(commands);

    return directive.response();
  }

  /**
   * Adjusts the target temperature
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async adjustTargetTemperature(directive, openhab) {
    const capability = directive.endpoint.getCapability({ interface: directive.namespace });

    // Throw invalid value error if no thermostat capability defined
    if (typeof capability === 'undefined') {
      throw new InvalidValueError('The thermostat has no capability defined.');
    }

    const properties = capability.getPropertyMap();
    const thermostatHold = properties[Property.THERMOSTAT_HOLD];
    const thermostatMode = properties[Property.THERMOSTAT_MODE];

    // Get current alexa thermostat mode if property defined, retrievable and supports setpoint mode
    const mode =
      thermostatMode && thermostatMode.isRetrievable && thermostatMode.supportsSetpointMode !== false
        ? await openhab.getItemState(thermostatMode.item.name).then((state) => thermostatMode.getState(state))
        : undefined;

    // Throw thermostat off error if mode is off
    if (mode === ThermostatMode.OFF) {
      throw new ThermostatOffError('The thermostat is off.');
    }

    // Determine setpoint properties based on thermostat mode
    const setpointProperties = capability.getSetpointProperties(mode, properties);

    // Throw invalid value error if no setpoint properties defined
    if (Object.keys(setpointProperties).length === 0) {
      throw new InvalidValueError('The thermostat has no setpoint properties.');
    }

    // Extract setpoints based on setpoint properties mappings
    const { targetSetpoint, upperSetpoint, lowerSetpoint } = setpointProperties;
    // Determine adjust properties based on either target (single mode) or upper/lower (dual mode) setpoints
    const adjustProperties = targetSetpoint ? [targetSetpoint] : [upperSetpoint, lowerSetpoint];

    // Determine items to update based on adjust properties, clamping adjusted temperature to setpoint range
    const items = await Promise.all(
      adjustProperties.map(async (property) => {
        const { item, setpointRange, isRetrievable } = property;

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

        // Determine adjusted target temperature adding normalized directive payload delta value to current state
        const command = clamp(
          parseFloat(state) + property.getCommand(directive.payload.targetSetpointDelta, { isDelta: true }),
          setpointRange[0],
          setpointRange[1]
        );

        return { name: item.name, command };
      })
    );

    // Set thermostat hold prior to sending setpoint commands if required
    if (thermostatHold && thermostatHold.requiresSetpointHold) {
      await openhab.sendCommand(thermostatHold.item.name, thermostatHold.getCommand(ThermostatHold.ON));
    }

    // Define commands to send
    const commands = items.map((item) => openhab.sendCommand(item.name, item.command));

    await Promise.all(commands);

    return directive.response();
  }

  /**
   * Sets the mode of the thermostat
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async setThermostatMode(directive, openhab) {
    const property = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.THERMOSTAT_MODE
    });

    // Throw invalid value error if no thermostat mode property defined
    if (typeof property === 'undefined') {
      throw new InvalidValueError('The thermostat has no mode property.');
    }

    const mode = directive.payload.thermostatMode.value;
    const command = property.getCommand(mode);

    // Throw thermostat mode unsupported error if no command defined
    if (typeof command === 'undefined') {
      throw new ThermostatModeUnsupportedError(`The thermostat doesn't support ${mode} mode.`);
    }

    await openhab.sendCommand(property.item.name, command);

    return directive.response();
  }

  /**
   * Resumes the programmed schedule of the thermostat
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async resumeSchedule(directive, openhab) {
    const properties = directive.endpoint.getCapabilityPropertyMap({ interface: directive.namespace });
    const thermostatHold = properties[Property.THERMOSTAT_HOLD];
    const thermostatMode = properties[Property.THERMOSTAT_MODE];

    // Throw invalid value error if no thermostat hold property defined
    if (typeof thermostatHold === 'undefined') {
      throw new InvalidValueError('The thermostat has no hold property.');
    }

    // Get current alexa thermostat mode if property defined and retrievable
    const mode =
      thermostatMode && thermostatMode.isRetrievable
        ? await openhab.getItemState(thermostatMode.item.name).then((state) => thermostatMode.getState(state))
        : undefined;

    // Throw thermostat off error if mode is off
    if (mode === ThermostatMode.OFF) {
      throw new ThermostatOffError('The thermostat is off.');
    }

    const command = thermostatHold.getCommand(ThermostatHold.OFF);

    await openhab.sendCommand(thermostatHold.item.name, command);

    return directive.response();
  }
}

module.exports = ThermostatController;
