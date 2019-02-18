/**
 * Copyright (c) 2014-2019 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

var sprintf = require('sprintf-js').sprintf;

/**
 * Define alexa supported display categories
 */
var DISPLAY_CATEGORIES = [
  'ACTIVITY_TRIGGER', 'CAMERA', 'DOOR', 'LIGHT', 'MICROWAVE', 'OTHER', 'SCENE_TRIGGER',
  'SMARTLOCK', 'SMARTPLUG', 'SPEAKER', 'SWITCH', 'TEMPERATURE_SENSOR', 'THERMOSTAT', 'TV'
];

/**
  * Define openHAB item type supported capabilities
  */
var ITEM_TYPE_CAPABILITIES = {
  'BrightnessController':       {'brightness': ['Color', 'Dimmer']},
  'ChannelController':          {'channel': ['Number', 'String']},
  'ColorController':            {'color': ['Color']},
  'ColorTemperatureController': {'colorTemperatureInKelvin': ['Dimmer', 'Number']},
  'InputController':            {'input': ['Number', 'String']},
  'LockController':             {'lockState': ['Switch']},
  'PercentageController':       {'percentage': ['Dimmer', 'Rollershutter']},
  'PlaybackController':         {'playback': ['Player']},
  'PowerController':            {'powerState': ['Color', 'Dimmer', 'Rollershutter', 'Switch']},
  'PowerLevelController':       {'powerLevel': ['Dimmer']},
  'SceneController':            {'scene': ['Switch']},
  'Speaker':                    {'volume': ['Dimmer', 'Number'], 'muted': ['Switch']},
  'StepSpeaker':                {'volume': ['Dimmer', 'Number'], 'muted': ['Switch']},
  'TemperatureSensor':          {'temperature': ['Number', 'Number:Temperature']},
  'ThermostatController':       {'targetSetpoint': ['Number', 'Number:Temperature'],
                                 'lowerSetpoint': ['Number', 'Number:Temperature'],
                                 'upperSetpoint': ['Number', 'Number:Temperature'],
                                 'thermostatMode': ['Number', 'String']},
};

/**
 * Define alexa thermostat mode mapping based on binding used in OH
 */
var THERMOSTAT_MODE_MAPPING = {
  ecobee1: {AUTO: 'auto', COOL: 'cool', HEAT: 'heat', OFF: 'off'},
  nest: {AUTO: 'HEAT_COOL', COOL: 'COOL', HEAT: 'HEAT', ECO: 'ECO', OFF: 'OFF'},
  nest1: {AUTO: 'heat-cool', COOL: 'cool', HEAT: 'heat', ECO: 'eco', OFF: 'off'},
  zwave1: {AUTO: '3', COOL: '2', HEAT: '1', OFF: '0'},
  default: {AUTO: 'auto', COOL: 'cool', HEAT: 'heat', ECO: 'eco', OFF: 'off'}
};

/**
 * Normalizes thermostat modes based on binding name
 *   Alexa: AUTO, COOL, HEAT, ECO, OFF
 *   OH: depending on thermostat binding or user mappings defined
 *
 * @param  {String} mode
 * @param  {Object} parameters
 * @return {String}
 */
function normalizeThermostatMode(mode, parameters = {}) {
  var alexaModes = Object.keys(THERMOSTAT_MODE_MAPPING.default);
  var bindingName = parameters.binding ? parameters.binding.toLowerCase() : 'default';
  var userMap = Object.keys(parameters).reduce(function(map, param) {
    return Object.assign(map, alexaModes.includes(param) ? {[param]: parameters[param]} : {});
  }, {});
  var thermostatModeMap = Object.keys(userMap).length > 0 ? userMap : THERMOSTAT_MODE_MAPPING[bindingName];

  // Convert Alexa to OH
  if (alexaModes.includes(mode)) {
    return thermostatModeMap[mode];
  }
  // Convert OH to Alexa
  else {
    return Object.keys(thermostatModeMap).reduce(function(result, alexaMode) {
      if (typeof(thermostatModeMap[alexaMode]) !== 'undefined' &&
        thermostatModeMap[alexaMode].toString() === mode.toString()) result = alexaMode;
      return result;
    }, mode);
  }
}

/**
 * Normalizes temperature scale between Alexa value and OH expected scale
 *    Temperature e.g. {value: 21.5, scale: "CELSIUS"}
 *
 * @param  {Object}  temperature
 * @param  {String}  scale
 * @param  {Boolean} delta
 * @return {Float}
 */
function normalizeTemperatureScale(temperature, scale = 'CELSIUS', delta = false) {
  var conversion = temperature.scale.charAt(0) + '->' + scale.charAt(0);
  var value = parseFloat(temperature.value);

  switch (conversion.toUpperCase()) {
    case 'F->C':
      return (value - (!delta ? 32 : 0)) * 5 / 9;
    case 'C->F':
      return value * 9 / 5 + (!delta ? 32 : 0);
    default:
      return value;
  }
}

/**
 * Normalizes lock property state when using an item sensor (Contact, Number, Switch or String Item)
 *    User mapping e.g. [1=LOCKED,2=UNLOCKED,3=LOCKED,4=UNLOCKED,11=JAMMED] (Zwave)
 *
 * @param  {String} state
 * @param  {String} type
 * @param  {Object} parameters
 * @return {String}
 */
function normalizeLockState(state, type, parameters = {}) {
  var alexaStates = ['LOCKED', 'UNLOCKED', 'JAMMED'];
  var userMap = Object.keys(parameters).reduce(function(map, param) {
    return Object.assign(map, alexaStates.includes(parameters[param]) ? {[param]: parameters[param]} : {});
  }, {});

  // Convert OH to Alexa using user map, if defined, otherwise fallback to item type default
  if (userMap[state]) {
    return userMap[state];
  } else {
    switch(type) {
      case 'Contact':
        return state === 'CLOSED' ? 'LOCKED' : state === 'OPEN' ? 'UNLOCKED' : undefined;
      case 'Number':
        return parseInt(state) === 1 ? 'LOCKED' : parseInt(state) === 2 ? 'UNLOCKED' :
          parseInt(state) === 3 ? 'JAMMED' : undefined;
      case 'String':
        return state.toLowerCase() === 'locked' ? 'LOCKED' : state.toLowerCase() === 'unlocked' ? 'UNLOCKED' :
          state.toLowerCase() === 'jammed' ? 'JAMMED' : undefined;
      case 'Switch':
        return state === 'ON' ? 'LOCKED' : state === 'OFF' ? 'UNLOCKED' : undefined;
    }
  }
}

/**
 * Normalizes color temperature value based on item type
 *   Alexa colorTemperature api property spectrum from 1000K (warmer) to 10000K (colder)
 *
 *   Two item types:
 *     - Dimmer: colder (0%) to warmer (100%) based of Alexa color temperature spectrum [hue and lifx support]
 *     - Number: color temperature value in K [custom integration]
 *
 * @param  {String} value
 * @param  {String} type
 * @return {Integer}
 */
function normalizeColorTemperature(value, type) {
  // Return if value not numeric
  if (isNaN(value)) {
    return;
  }

  var minValue = 1000;
  var maxValue = 10000;
  switch (type) {
    case 'Dimmer':
      if (value > 100) {  // Convert Alexa to OH
        return (maxValue - value) / (maxValue - minValue) * 100;
      } else {            // Convert OH to Alexa
        return maxValue - (value * (maxValue - minValue) / 100);
      }
    case 'Number':
      // No convertion needed between Alexa & OH
      return value < minValue ? minValue : value < maxValue ? value : maxValue;
  }
}

/**
 * Normalizes OH item state based on state description pattern
 *
 * @param  {Object} item
 * @return {String}
 */
function normalizeItemState(item) {
  var pattern = item.stateDescription ? item.stateDescription.pattern : undefined;
  var state = item.state;
  var type = item.type.split(':')[0];

  if (pattern) {
    switch (type) {
      case 'Dimmer':
      case 'Number':
      case 'Rollershutter':
        return sprintf(pattern, state != 'NULL' ? parseFloat(state) : state);
      case 'String':
        return sprintf(pattern, state);
    }
  }
  return state;
}

/**
 * Determines if display category is supported by alexa api
 * @param  {String} category
 * @return {Boolean}
 */
function supportedDisplayCategory(category) {
  return DISPLAY_CATEGORIES.includes(category.toUpperCase());
}

/**
 * Determines if openHAB item type is supported by alexa capability
 * @param  {String} type
 * @param  {String} controller
 * @param  {String} property
 * @return {Boolean}
 */
function supportedItemTypeCapability(type, controller, property) {
  if (ITEM_TYPE_CAPABILITIES[controller] && ITEM_TYPE_CAPABILITIES[controller][property]) {
    return ITEM_TYPE_CAPABILITIES[controller][property].includes(type);
  }
}

/**
 * Returns date in iso string format
 * @return {String}
 */
function date() {
  var date = new Date();
  return date.toISOString();
}

/**
 * Returns time epoch seconds
 * @return {Integer}
 */
function timeInSeconds() {
  var time = new Date().getTime();
  return Math.round(time / 1000);
}

/**
 * Returns JSON object if parseable otherwise text
 * @param  {String} text
 * @return {Object}
 */
function parseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

module.exports.date = date;
module.exports.parseJSON = parseJSON;
module.exports.timeInSeconds = timeInSeconds;

module.exports.normalizeColorTemperature = normalizeColorTemperature;
module.exports.normalizeItemState = normalizeItemState;
module.exports.normalizeLockState = normalizeLockState;
module.exports.normalizeTemperatureScale = normalizeTemperatureScale;
module.exports.normalizeThermostatMode = normalizeThermostatMode;
module.exports.supportedDisplayCategory = supportedDisplayCategory;
module.exports.supportedItemTypeCapability = supportedItemTypeCapability;
