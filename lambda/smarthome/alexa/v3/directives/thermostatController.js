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
const { getPropertySchema, getThermostatSetpointProperties } = require('../capabilities.js');
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
    const properties = this.propertyMap.ThermostatController;
    const getThermostatMode = properties.thermostatMode &&
      properties.thermostatMode.parameters.supportsSetpointMode !== false ?
      this.getItemState(properties.thermostatMode.item) : Promise.resolve();

    // Get latest thermostat mode item state if property defined
    getThermostatMode.then((item) => {
      // Determine alexa normalized thermostat mode if item defined
      const thermostatMode = item && normalize(properties.thermostatMode, item.state);
      // Determine setpoint mode properties based on thermostat mode
      const setpointProperties = getThermostatSetpointProperties(thermostatMode, properties);
      // Determine request mode properties based on directive payload setpoint-named properties
      const requestProperties = Object.keys(this.directive.payload).filter(name => name.endsWith('Setpoint'));
      // Determine comfort range based on upper/lower setpoints properties if both defined
      const comfortRange = Object.assign({}, properties.upperSetpoint && properties.lowerSetpoint && {
        upper: parseFloat(properties.upperSetpoint.parameters.comfortRange) ||
          getPropertySchema('temperature', `.state.range.default.comfort.${properties.upperSetpoint.parameters.scale}`),
        lower: parseFloat(properties.lowerSetpoint.parameters.comfortRange) ||
          getPropertySchema('temperature', `.state.range.default.comfort.${properties.lowerSetpoint.parameters.scale}`)
      });

      // Update thermostat mode item in propertyMap object if item defined, removing need to get latest state again
      if (item) {
        Object.assign(properties.thermostatMode.item, item);
      }

      // Return error response if thermostat mode is off
      if (thermostatMode === 'OFF') {
        return this.returnAlexaErrorResponse({
          namespace: this.directive.header.namespace,
          payload: {
            type: 'THERMOSTAT_IS_OFF',
            message: 'The thermostat is off.'
          }
        });
      }
      // Return error response if thermostat not currently in dual/triple mode while request is
      if (requestProperties.length > 1 && requestProperties.some(property => !setpointProperties.includes(property))) {
        const mode = requestProperties.length === 2 ? 'dual' : 'triple';
        return this.returnAlexaErrorResponse({
          namespace: this.directive.header.namespace,
          payload: {
            type: `${mode.toUpperCase()}_SETPOINTS_UNSUPPORTED`,
            message: `The thermostat doesn't support ${mode} setpoints in the current mode.`
          }
        });
      }
      // Return error response if requested setpoints too close in dual/triple mode
      if (requestProperties.includes('upperSetpoint') && requestProperties.includes('lowerSetpoint')) {
        // Determine minimum temperature setpoint delta by adding upper and lower comfort range
        const minimumTemperatureDelta = comfortRange.upper + comfortRange.lower;
        // Determine request temperature setpoint delta by subtracting upper to lower directive normalized setpoints
        const requestTemperatureDelta = normalize(properties.upperSetpoint, this.directive.payload.upperSetpoint) -
          normalize(properties.lowerSetpoint, this.directive.payload.lowerSetpoint);

        if (minimumTemperatureDelta > requestTemperatureDelta) {
          return this.returnAlexaErrorResponse({
            namespace: this.directive.header.namespace,
            payload: {
              type: 'REQUESTED_SETPOINTS_TOO_CLOSE',
              message: 'The temperature setpoints are too close together.',
              minimumTemperatureDelta: {
                value: minimumTemperatureDelta,
                scale: properties.upperSetpoint.parameters.scale || properties.upperSetpoint.lowerSetpoint.scale
              }
            }
          });
        }
      }

      // Add requested properties to be updated based on setpoint properties mappings
      //  (e.g. upperSetpoint@targetSetpoint => set upper setpoint item state to target setpoint request value)
      const postItems = setpointProperties
        .filter(property => requestProperties.includes(property.split('@').pop()))
        .reduce((items, property) => {
          const [propertyName, payloadName] = property.split('@');
          return items.concat(Object.assign({}, properties[propertyName].item, {
            state: normalize(properties[propertyName], this.directive.payload[payloadName || propertyName])
          }));
        }, []);

      // Update upper/lower setpoints using comfort range if request has target setpoint and thermostat in dual mode
      if (requestProperties.includes('targetSetpoint') && setpointProperties.length === 2) {
        postItems.push(Object.assign({}, properties.upperSetpoint.item, {
          state: normalize(properties.upperSetpoint, this.directive.payload.targetSetpoint) + comfortRange.upper
        }), Object.assign({}, properties.lowerSetpoint.item, {
          state: normalize(properties.lowerSetpoint, this.directive.payload.targetSetpoint) - comfortRange.lower
        }));
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
        // Limit properties response to thermostat mode and post item properties only
        this.postItemsAndReturn(postItems, {properties: [].concat('thermostatMode', postItems.map(item =>
          Object.keys(properties).find(propertyName => properties[propertyName].item.name === item.name)))
        });
      } else {
        this.returnAlexaErrorResponse({
          payload: {
            type: 'TEMPERATURE_VALUE_OUT_OF_RANGE',
            message: rangeError.message,
            validRange: rangeError.validRange
          }
        });
      }
    }).catch((error) => {
      log.error('setTargetTemperature failed with error:', error);
      this.returnAlexaGenericErrorResponse(error);
    });
  }

  /**
   * Adjusts the target setpoint + or - the targetSetpointDelta
   */
  adjustTargetTemperature() {
    const properties = this.propertyMap.ThermostatController;
    const getThermostatMode = properties.thermostatMode &&
      properties.thermostatMode.parameters.supportsSetpointMode !== false ?
      this.getItemState(properties.thermostatMode.item) : Promise.resolve();

    // Get latest thermostat mode item state if property defined
    getThermostatMode.then((item) => {
      // Determine alexa normalized thermostat mode if item defined
      const thermostatMode = item && normalize(properties.thermostatMode, item.state);
      // Determine setpoint mode properties based on thermostat mode
      const setpointProperties = getThermostatSetpointProperties(thermostatMode, properties);

      // Update thermostat mode item in propertyMap object if item defined, removing need to get latest state again
      if (item) {
        Object.assign(properties.thermostatMode.item, item);
      }

      // Return error response if thermostat mode is off
      if (thermostatMode === 'OFF') {
        return this.returnAlexaErrorResponse({
          namespace: this.directive.header.namespace,
          payload: {
            type: 'THERMOSTAT_IS_OFF',
            message: 'The thermostat is off.'
          }
        });
      }

      // Adjust upper/lower setpoints if in dual mode, otherwise target setpoint based on setpoint properties mappings
      //  (e.g. upperSetpoint@targetSetpoint => adjust upper setpoint item state as target setpoint)
      const adjustProperties = setpointProperties.length === 2 ? setpointProperties :
        [setpointProperties.find(property => property.endsWith('targetSetpoint')).split('@').shift()];

      // Determine post items promises list based on adjust properties, clamping adjusted temperature to setpoint range
      const promises = adjustProperties.reduce((promises, propertyName) => {
        const scale = properties[propertyName].parameters.scale;
        const range = properties[propertyName].parameters.setpointRange ||
          getPropertySchema('temperature', `.state.range.default.setpoint.${scale}`);
        const clamp = (value) => Math.min(Math.max(value, range[0]), range[1]);

        return promises.concat(this.getItemState(properties[propertyName].item).then(item =>
          Object.assign({}, properties[propertyName].item, {
            state: clamp(parseFloat(item.state) + normalize(properties[propertyName],
              this.directive.payload.targetSetpointDelta, {isDelta: true}))
          })
        ));
      }, []);

      // Return adjust post items list
      return Promise.all(promises);
    }).then((postItems) => {
      log.debug('adjustTargetTemperature to values:', {items: postItems});
      // Limit properties response to thermostat mode and post item properties only
      this.postItemsAndReturn(postItems, {properties: [].concat('thermostatMode', postItems.map(item =>
        Object.keys(properties).find(propertyName => properties[propertyName].item.name === item.name)))
      });
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
