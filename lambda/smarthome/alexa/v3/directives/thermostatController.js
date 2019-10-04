/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
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

const decamelize = require('decamelize');
const log = require('@lib/log.js');
const { getPropertySchema } = require('../capabilities.js');
const AlexaDirective = require('../directive.js');
const { normalize } = require('../propertyState.js');

/**
 * Defines Alexa.ThermostatController interface directive class
 * @extends AlexaDirective
 */
class AlexaThermostatController extends AlexaDirective {
  /**
   * Constructor
   * @param {Object}   directive
   * @param {Function} callback
   */
  constructor(directive, callback) {
    super(directive, callback);
    this.interface = 'ThermostatController';
    this.map = {
      setTargetTemperature: 'setTargetTemperature',
      adjustTargetTemperature: 'adjustTargetTemperature',
      setThermostatMode: 'setThermostatMode',
      resumeSchedule: undefined
    };
  }

  /**
   * Sets the target temperature, this can include upper, lower and target setpoints
   * in the same request.
   */
  setTargetTemperature() {
    const directive = this.directive;
    const properties = this.propertyMap.ThermostatController;
    // Add requested properties to be updated that are part of the controller properties
    const postItems = Object.keys(properties).reduce((items, propertyName) => {
      if (directive.payload[propertyName]) {
        items.push(Object.assign({}, properties[propertyName].item, {
          state: normalize(properties[propertyName], directive.payload[propertyName])
        }));
      }
      return items;
    }, []);

    // Support Comfort Ranges if only a target setpoint is sent by Alexa, but a user does not define one.
    // Only works if the user has no defined targetSetpoint, but does define a upper and lower (dual mode)
    if (directive.payload.targetSetpoint && !directive.payload.upperSetpoint && !directive.payload.lowerSetpoint &&
      !properties.targetSetpoint && properties.upperSetpoint && properties.lowerSetpoint) {
      // define upper/lower comfort ranges
      const upperRange = parseFloat(properties.upperSetpoint.parameters.comfortRange) ||
        getPropertySchema('temperature', `.state.range.default.comfort.${properties.upperSetpoint.parameters.scale}`);
      const lowerRange = parseFloat(properties.lowerSetpoint.parameters.comfortRange) ||
        getPropertySchema('temperature', `.state.range.default.comfort.${properties.lowerSetpoint.parameters.scale}`);
      // set dual setpoints
      postItems.push(
        Object.assign({}, properties.upperSetpoint.item, {
          state: normalize(properties.upperSetpoint, directive.payload.targetSetpoint) + upperRange
        }),
        Object.assign({}, properties.lowerSetpoint.item, {
          state: normalize(properties.lowerSetpoint, directive.payload.targetSetpoint) - lowerRange
        })
      );
    }

    // Determine if one of the target temperatures is out of range
    const rangeError = postItems.reduce((error, item) => {
      const propertyName = Object.keys(properties).find(
        propertyName => properties[propertyName].item.name === item.name);
      const scale = properties[propertyName].parameters.scale;
      const range = properties[propertyName].parameters.setpointRange ||
        getPropertySchema('temperature', `.state.range.default.setpoint.${scale}`);

      return item.state >= range[0] && item.state <= range[1] ? error : {
        message: `The ${decamelize(propertyName, ' ')} temperature cannot be set to ${item.state}°${scale.charAt(0)}.`,
        validRange: {
          minimumValue: {
            value: range[0],
            scale: scale
          },
          maximumValue: {
            value: range[1],
            scale: scale
          }
        }
      };
    }, undefined);

    if (typeof rangeError === 'undefined') {
      log.debug('setTargetTemperature to values:', {items: postItems});
      this.postItemsAndReturn(postItems);
    } else {
      this.returnAlexaErrorResponse({
        payload: {
          type: 'TEMPERATURE_VALUE_OUT_OF_RANGE',
          message: rangeError.message,
          validRange: rangeError.validRange
        }
      });
    }
  }

  /**
   * Adjusts the target setpoint + or - the targetSetpointDelta
   */
  adjustTargetTemperature() {
    const properties = this.propertyMap.ThermostatController;
    const propertyNames = [];
    const promises = [];

    // adjust target setpoint if defined otherwise upper/lower setpoints if in dual mode
    if (properties.targetSetpoint) {
      propertyNames.push('targetSetpoint');
    } else if (properties.upperSetpoint && properties.lowerSetpoint) {
      propertyNames.push('upperSetpoint', 'lowerSetpoint');
    }
    propertyNames.forEach((propertyName) => {
      const scale = properties[propertyName].parameters.scale;
      const range = properties[propertyName].parameters.setpointRange ||
        getPropertySchema('temperature', `.state.range.default.setpoint.${scale}`);
      const clamp = (value) => Math.min(Math.max(value, range[0]), range[1]);

      promises.push(this.getItemState(properties[propertyName].item).then(item =>
        Object.assign({}, properties[propertyName].item, {
          state: clamp(parseFloat(item.state) + normalize(properties[propertyName],
            this.directive.payload.targetSetpointDelta, {isDelta: true}))
        })
      ));
    });
    Promise.all(promises).then((postItems) => {
      log.debug('adjustTargetTemperature to values:', {items: postItems});
      this.postItemsAndReturn(postItems);
    }).catch((error) => {
      this.returnAlexaGenericErrorResponse(error);
    });
  }

  /**
   * Sets the mode of the thermostat
   */
  setThermostatMode() {
    const properties = this.propertyMap.ThermostatController;
    const postItem = Object.assign({}, properties.thermostatMode.item, {
      state: normalize(properties.thermostatMode, this.directive.payload.thermostatMode.value)
    });

    if (typeof postItem.state !== 'undefined') {
      this.postItemsAndReturn([postItem]);
    } else {
      this.returnAlexaErrorResponse({
        namespace: this.directive.header.namespace,
        payload: {
          type: 'UNSUPPORTED_THERMOSTAT_MODE',
          message: `${postItem.name} doesn't support thermostat mode [${this.directive.payload.thermostatMode.value}]`
        }
      });
    }
  }
}

module.exports = AlexaThermostatController;
