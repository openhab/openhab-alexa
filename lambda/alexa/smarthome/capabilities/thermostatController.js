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
const { TargetSetpoint, UpperSetpoint, LowerSetpoint, ThermostatMode, ThermostatHold } = require('../properties');

/**
 * Defines Alexa.ThermostatController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-thermostatcontroller.html
 * @extends AlexaCapability
 */
class ThermostatController extends AlexaCapability {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_THERMOSTAT_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.TARGET_SETPOINT]: TargetSetpoint,
      [Property.UPPER_SETPOINT]: UpperSetpoint,
      [Property.LOWER_SETPOINT]: LowerSetpoint,
      [Property.THERMOSTAT_MODE]: ThermostatMode,
      [Property.THERMOSTAT_HOLD]: ThermostatHold
    };
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return [AlexaDisplayCategory.THERMOSTAT];
  }

  /**
   * Returns capability configuration
   * @return {Object}
   */
  getCapabilityConfiguration() {
    const configuration = {};
    const thermostatMode = this.getProperty({ name: Property.THERMOSTAT_MODE });

    if (thermostatMode) {
      configuration.supportedModes = thermostatMode.supportedModes;
      configuration.supportsScheduling = this.hasProperty({ name: Property.THERMOSTAT_HOLD });
    }

    return configuration;
  }

  /**
   * Returns reportable properties
   * @param  {Array}  items
   * @param  {Object} properties
   * @return {Array}
   */
  getReportableProperties(items, properties) {
    const thermostatMode = properties[Property.THERMOSTAT_MODE];

    if (thermostatMode) {
      const item = items.find((item) => item.name === thermostatMode.item.name) || {};
      const mode = thermostatMode.getState(item.state);
      const setpointProperties = this.getSetpointProperties(mode, properties);
      // Return thermostat mode and relevant setpoint properties
      return [thermostatMode, ...Object.values(setpointProperties)];
    }

    // Return reportable properties from parent method otherwise
    return super.getReportableProperties(items, properties);
  }

  /**
   * Returns setpoint properties for a given thermostat mode
   * @param  {String} thermostatMode
   * @param  {Object} properties
   * @return {Object}
   */
  getSetpointProperties(thermostatMode, properties) {
    const targetSetpoint = properties[Property.TARGET_SETPOINT];
    const upperSetpoint = properties[Property.UPPER_SETPOINT];
    const lowerSetpoint = properties[Property.LOWER_SETPOINT];

    if (thermostatMode === ThermostatMode.AUTO || thermostatMode === ThermostatMode.ECO) {
      const taggedProperties = Object.values(properties).filter(
        (property) =>
          (property instanceof UpperSetpoint || property instanceof LowerSetpoint) &&
          property.tag === thermostatMode.toLowerCase()
      );
      // Use tagged properties setpoints if defined, fallback to upper/lower setpoints if defined
      if (taggedProperties.length === 2) {
        return Object.fromEntries(taggedProperties.map((property) => [property.name, property]));
      } else if (upperSetpoint && lowerSetpoint) {
        return { upperSetpoint, lowerSetpoint };
      }
    } else if (thermostatMode === ThermostatMode.COOL) {
      // Use target setpoint if defined, fallback to upper setpoint mapped as target setpoint if defined
      if (targetSetpoint) {
        return { targetSetpoint };
      } else if (upperSetpoint) {
        upperSetpoint.reportName = Property.TARGET_SETPOINT;
        return { targetSetpoint: upperSetpoint };
      }
    } else if (thermostatMode === ThermostatMode.HEAT) {
      // Use target setpoint if defined, fallback to lower setpoint mapped as target setpoint if defined
      if (targetSetpoint) {
        return { targetSetpoint };
      } else if (lowerSetpoint) {
        lowerSetpoint.reportName = Property.TARGET_SETPOINT;
        return { targetSetpoint: lowerSetpoint };
      }
    } else if (thermostatMode === ThermostatMode.OFF) {
      // No setpoint
      return {};
    }

    // Return standard defined setpoint properties as fallback
    return {
      ...(targetSetpoint && { targetSetpoint }),
      ...(upperSetpoint && { upperSetpoint }),
      ...(lowerSetpoint && { lowerSetpoint })
    };
  }
}

module.exports = ThermostatController;
