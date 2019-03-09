/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

const log = require('@lib/log.js');
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
   * Sets the taget temperature, this can include upper, lower and target setpoints
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
      // default range if not set
      let upperRange = properties.upperSetpoint.parameters.scale === 'FAHRENHEIT' ? 1 : .5;
      let lowerRange = properties.lowerSetpoint.parameters.scale === 'FAHRENHEIT' ? 1 : .5;
      // use user defined comfort range if set
      if (typeof properties.upperSetpoint.parameters.comfortRange !== 'undefined') {
        upperRange = parseFloat(properties.upperSetpoint.parameters.comfortRange);
      }
      if (typeof properties.lowerSetpoint.parameters.comfortRange !== 'undefined') {
        lowerRange = parseFloat(properties.lowerSetpoint.parameters.comfortRange);
      }
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

    log.debug('setTargetTemperature to values:', postItems);
    this.postItemsAndReturn(postItems);
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
      promises.push(this.getItemState(properties[propertyName].item).then(item =>
        Object.assign({}, properties[propertyName].item, {
          state: parseFloat(item.state) + normalize(properties[propertyName],
            this.directive.payload.targetSetpointDelta, {isDelta: true})
        })
      ));
    });
    Promise.all(promises).then((postItems) => {
      log.debug('adjustTargetTemperature to values:', postItems);
      this.postItemsAndReturn(postItems);
    }).catch((error) => {
      log.error('adjustTargetTemperature failed with error:', error);
      this.returnAlexaGenericErrorResponse();
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
