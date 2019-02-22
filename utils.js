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
  'ACTIVITY_TRIGGER', 'CAMERA', 'CONTACT_SENSOR', 'DOOR', 'DOORBELL', 'LIGHT', 'MICROWAVE',
  'MOTION_SENSOR', 'OTHER', 'SCENE_TRIGGER', 'SECURITY_PANEL', 'SMARTLOCK', 'SMARTPLUG',
  'SPEAKER', 'SWITCH', 'TEMPERATURE_SENSOR', 'THERMOSTAT', 'TV'
];

/**
 * Define OH state description formatter pattern
 */
var ITEM_STATE_FORMATTER_PATTERN = /%(?:[.0]\d+)?[dfs]/;

/**
 * Define openHAB item type supported capabilities
 */
var ITEM_TYPE_CAPABILITIES = {
  'BrightnessController':       {'brightness': ['Color', 'Dimmer']},
  'ChannelController':          {'channel': ['Number', 'String']},
  'ColorController':            {'color': ['Color']},
  'ColorTemperatureController': {'colorTemperatureInKelvin': ['Dimmer', 'Number']},
  'ContactSensor':              {'detectionState': ['Contact', 'Switch']},
  'InputController':            {'input': ['Number', 'String']},
  'LockController':             {'lockState': ['Switch']},
  'MotionSensor':               {'detectionState': ['Contact', 'Switch']},
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
 * Define alexa property state mapping based on OH item type
 */
var ITEM_TYPE_PROPERTY_STATE_MAPPING = {
  'detectionState': {
    'Contact': {CLOSED: 'NOT_DETECTED', OPEN: 'DETECTED'},
    'Switch':  {OFF: 'NOT_DETECTED', ON: 'DETECTED'}
  },
  'lockState': {
    'Contact': {CLOSED: 'LOCKED', OPEN: 'UNLOCKED'},
    'Number':  {1: 'LOCKED', 2: 'UNLOCKED', 3: 'JAMMED'},
    'String':  {LOCKED: 'LOCKED', UNLOCKED: 'UNLOCKED', JAMMED: 'JAMMED'},
    'Switch':  {ON: 'LOCKED', OFF: 'UNLOCKED'}
  }
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
 *    Temperature e.g. {value: 21.5, scale: 'CELSIUS'}
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
 * Normalizes property state based on user map if provided, otherwise on item type default map
 *    User mapping e.g. [1=LOCKED,2=UNLOCKED,3=LOCKED,4=UNLOCKED,11=JAMMED] (lockState)
 *
 * @param  {String} name
 * @param  {Object} property
 * @return {String}
 */
function normalizePropertyState(name, property) {
  var parameters = property.parameters;
  var state = property.item.state.toUpperCase();
  var type = property.item.type;

  var itemTypeMap = ITEM_TYPE_PROPERTY_STATE_MAPPING[name] && ITEM_TYPE_PROPERTY_STATE_MAPPING[name][type] ?
    ITEM_TYPE_PROPERTY_STATE_MAPPING[name][type] : {};
  var alexaStates = Object.values(itemTypeMap);
  var userMap = Object.keys(parameters).reduce(function(map, param) {
    return Object.assign(map, alexaStates.includes(parameters[param]) ? {[param]: parameters[param]} : {});
  }, {});

  return userMap[state] || itemTypeMap[state] || state;
}

/**
 * Normalizes OH item state based on state description pattern
 *
 * @param  {Object} item
 * @return {String}
 */
function normalizeItemState(item) {
  var format = item.stateDescription && item.stateDescription.pattern &&
    item.stateDescription.pattern.match(ITEM_STATE_FORMATTER_PATTERN);
  var state = item.state;
  var type = item.type.split(':')[0];

  if (format && state != 'NULL') {
    switch (type) {
      case 'Dimmer':
      case 'Number':
      case 'Rollershutter':
        return sprintf(format[0], parseFloat(state));
      case 'String':
        return sprintf(format[0], state);
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
module.exports.normalizePropertyState = normalizePropertyState;
module.exports.normalizeTemperatureScale = normalizeTemperatureScale;
module.exports.normalizeThermostatMode = normalizeThermostatMode;
module.exports.supportedDisplayCategory = supportedDisplayCategory;
module.exports.supportedItemTypeCapability = supportedItemTypeCapability;
