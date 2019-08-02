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

/**
 * Amazon Smart Home Skill Property State for API V3
 */
const { getPropertySchema, getPropertyStateMap } = require('./capabilities.js');

/**
 * Defines normalize functions
 * @type {Object}
 */
const normalizeFunctions = {
  /**
   * Normalizes brightness value
   * @param  {*}      value
   * @return {Integer}
   */
  brightness: function (value) {
    // Extract brightness level from color item state
    if (value.split(',').length === 3) {
      value = value.split(',').pop();
    }
    if (isNaN(value)) {
      value = value === 'ON' ? 100 : 0;
    }
    return parseInt(value);
  },

  /**
   * Normalizes channel value
   * @param  {*}      value
   * @return {String}
   */
  channel: function (value) {
    return {
      number: value.toString()
    };
  },

  /**
   * Normalizes color value
   * @param  {String} value
   * @return {Object}
   */
  color: function (value) {
    const hsb = value.split(',');

    if (hsb.length === 3 && hsb.every(i => !isNaN(i))) {
      return {
        hue: parseFloat(hsb[0]),
        saturation: parseFloat(hsb[1]) / 100.0,
        brightness: parseFloat(hsb[2]) / 100.0
      };
    }
  },

  /**
   * Normalizes color temperature value based on item type
   *   Alexa colorTemperature api property spectrum from 1000K (warmer) to 10000K (colder)
   *
   *   Two item types:
   *     - Dimmer: colder (0%) to warmer (100%) [bindings integration]
   *     - Number: color temperature value in K [custom integration]
   *
   * @param  {String} value
   * @param  {Object} property
   * @return {Integer}
   */
  colorTemperatureInKelvin: function (value, property) {
    const type = property.item.type;
    const defaultRange = getPropertySchema('colorTemperatureInKelvin', '.state.range.default');
    const temperatureRange = property.parameters.range || defaultRange;
    const minValue = Math.max(temperatureRange[0], defaultRange[0]);
    const maxValue = Math.min(temperatureRange[1], defaultRange[1]);
    const clamp = (value) => Math.min(Math.max(value, minValue), maxValue);

    // Return if value not numeric
    if (isNaN(value)) {
      return;
    }
    // Return value based on item type
    switch (type) {
      case 'Dimmer':
        if (value > 100) {  // Convert Alexa to OH
          return (maxValue - clamp(value)) / (maxValue - minValue) * 100;
        } else {            // Convert OH to Alexa
          return maxValue - (value * (maxValue - minValue) / 100);
        }
      case 'Number':
        // No convertion needed between Alexa & OH
        return clamp(value);
    }
  },

  /**
   * Normalizes inputs value
   * @param  {String} value
   * @return {String}
   */
  inputs: function (value) {
    const input = value.replace(/(\S)(\d+)$/, '$1 $2').toUpperCase();

    if (getPropertySchema('inputs', '.state.supported').includes(input)) {
      return input;
    }
  },

  /**
   * Normalizes percentage value
   * @param  {*}      value
   * @return {Integer}
   */
  percentage: function (value) {
    return this.brightness(value);
  },

  /**
   * Normalizes playback state value
   * @param  {String} value
   * @return {Object}
   */
  playbackState: function (value) {
    const map = {'PLAY': 'PLAYING', 'PAUSE': 'PAUSED', 'REWIND': 'PLAYING', 'FASTFORWARD': 'PLAYING'};
    return {
      state: map[value]
    };
  },

  /**
   * Normalizes power state value
   * @param  {*}      value
   * @return {String}
   */
  powerState: function (value) {
    // Extract brightness level from color item state
    if (value.split(',').length === 3) {
      value = value.split(',').pop();
    }
    if (!isNaN(value)) {
      const num = parseInt(value);
      value = num > 0 ? 'ON' : 'OFF';
    }
    return value;
  },

  /**
   * Normalizes temperature
   * @param  {*}      temperature
   * @param  {Object} property
   * @param  {Object} options
   * @return {Float}
   */
  temperature: function (temperature, property, options = {}) {
    const isDelta = options.isDelta === true;
    const scale = property.parameters.scale;

    // Convert OH to Alexa
    if (typeof temperature !== 'object') {
      return {value: parseFloat(temperature), scale: scale.toUpperCase()};
    }
    // Convert Alexa to OH
    const conversion = temperature.scale.charAt(0) + '->' + scale.charAt(0);
    const value = parseFloat(temperature.value);

    switch (conversion.toUpperCase()) {
      case 'C->F':
        return value * 9 / 5 + (isDelta ? 0 : 32);
      case 'F->C':
        return (value - (isDelta ? 0 : 32)) * 5 / 9;
      case 'C->K':
        return value + (isDelta ? 0 : 273.15);
      case 'K->C':
        return value - (isDelta ? 0 : 273.15);
      case 'F->K':
        return (value - (isDelta ? 0 : 32)) * 5 / 9 + (isDelta ? 0 : 273.15);
      case 'K->F':
        return (value - (isDelta ? 0 : 273.15)) * 9 / 5 + (isDelta ? 0 : 32);
      default:
        return value;
    }
  },

  /**
   * Normalizes toggle state value
   * @param  {*}      value
   * @return {String}
   */
  toggleState: function (value) {
    return this.powerState(value);
  }
};

/**
 * Normalizes property state for a given interface property from one of the steps in the order below:
 *
 *    1) normalize function
 *      use for data manipulation which cannot be handled by property state map
 *    2) property state map
 *      a) user map (provided in property parameters)
 *        e.g. [LOCKED="1:3",UNLOCKED="2:4",JAMMED=11] (lockState)
 *      b) custom map (based on a specific property parameter)
 *        e.g. [binding="nest"] (thermostatMode)
 *      c) default map (based on item type)
 *
 * @param  {Object} property
 * @param  {*}      value       [only needed if normalizing directive payload value]
 * @param  {Object} options     [additional options to be passed to normalize function]
 * @return {String}
 */
function normalize(property, value, options) {
  const propertyStateMap = getPropertyStateMap(property);
  const method = property.schema.name;
  let state = typeof value !== 'undefined' ? value :
    typeof property.item.state === 'string' ? property.item.state.split(':').shift() : property.item.state;

  // Return if state not defined
  if (typeof state === 'undefined') {
    return;
  }
  // Return normalized property state using method if defined
  if (typeof normalizeFunctions[method] === 'function') {
    return normalizeFunctions[method](state, property, options);
  }
  // Return normalized property state using state map otherwise
  //  { <alexaState>: '<ohState1>:<ohState2>:...', ... }
  if (Object.keys(propertyStateMap).length > 0) {
    if (typeof propertyStateMap[state] !== 'undefined') {
      // Convert Alexa to OH if state in property map
      state = typeof propertyStateMap[state] === 'string' ?
        propertyStateMap[state].split(':').shift() : propertyStateMap[state];
    } else {
      // Convert OH to Alexa otherwise
      state = Object.keys(propertyStateMap).find(
        key => propertyStateMap[key].toString().split(':').includes(state.toString()));
    }
  }
  return state;
}

module.exports.normalize = normalize;
