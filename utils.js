/**
 * Copyright (c) 2014-2016 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

 /**
 * Define alexa capability namespace format pattern
 **/
 var CAPABILITY_PATTERN = /^(?:Alexa\.)?(\w+)\.(\w+)$/;

 /**
 * Define alexa supported display categories
 **/
 var DISPLAY_CATEGORIES = [
   'ACTIVITY_TRIGGER', 'CAMERA', 'DOOR', 'LIGHT', 'MICROWAVE', 'OTHER', 'SCENE_TRIGGER',
   'SMARTLOCK', 'SMARTPLUG', 'SPEAKER', 'SWITCH', 'TEMPERATURE_SENSOR', 'THERMOSTAT', 'TV'
 ];

/**
* Define alexa thermostat mode mapping based on binding used in OH
**/
var THERMOSTAT_MODE_MAPPING = {
  ecobee: {AUTO: 'auto', COOL: 'cool', HEAT: 'heat', OFF: 'off'},
  nest: {AUTO: 'heat-cool', COOL: 'cool', HEAT: 'heat', ECO: 'eco', OFF: 'off'},
  zwave: {AUTO: '3', COOL: '2', HEAT: '1', OFF: '0'},
  default: {AUTO: 'auto', COOL: 'cool', HEAT: 'heat', ECO: 'eco', OFF: 'off'}
};

/**
* Normilizes thermostat modes based on binding name
*   Alexa: AUTO, COOL, HEAT, ECO, OFF
*   OH: depending on thermostat binding or user mappings defined
**/
function normalizeThermostatMode(mode, parameters = {}) {
  var alexaModes = Object.keys(THERMOSTAT_MODE_MAPPING.default);
  var bindingName = parameters.binding ? parameters.binding.toLowerCase() : 'default';
  var userMap = Object.keys(parameters).reduce(function(map, param) {
    if (alexaModes.includes(param)) map[param] = parameters[param];
    return map;
  }, {});
  var thermostatModeMap = Object.keys(userMap).length > 0 ? userMap : THERMOSTAT_MODE_MAPPING[bindingName];

  // Convert Alexa to OH
  if (alexaModes.includes(mode)) {
    return thermostatModeMap[mode];
  }
  // Convert OH to Alexa
  else {
    return Object.keys(thermostatModeMap).reduce(function(result, alexaMode) {
      if (typeof(thermostatModeMap[alexaMode]) !== 'undefined' && thermostatModeMap[alexaMode].toString() === mode.toString()) result = alexaMode;
      return result;
    }, undefined);
  }
}

/**
* Normilizes color temperature value based on item type
*   Alexa colorTemperature api property spectrum from 1000K (warmer) to 10000K (colder)
*
*   Two item types:
*     - Dimmer: colder (0%) to warmer (100%) based of Alexa color temperature spectrum [hue and lifx support]
*     - Number: color temperature value in K [custom integration]
**/
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
* Returns date in iso string format
*/
function date() {
  var d = new Date();
  return d.toISOString();
}

/**
* Determines if display category is supported by alexa api
*/
function supportedDisplayCategory(category) {
  return DISPLAY_CATEGORIES.includes(category.toUpperCase());
}

/**
 * Creates/Modifies a map structure to assoicate items to an endpoint from metadata, will return a new map
 * if propertyMap is omitted or null, otherwise will modify the existing map (and return it as well)
 * eg:
 *
 * OH Metadata
 *
 * Number FooTargetSetPoint "Foo Target SetPoint" {alexa="ThermostatController.targetSetpoint" [scale="Fahrenheit"]}
 * Number FooUpperSetPoint  "Foo Upper SetPoint"  {alexa="ThermostatController.upperSetpoint" [scale="Fahrenheit"]}
 * Number FooLowerSetPoint  "Foo Lower SetPoint"  {alexa="ThermostatController.lowerSetpoint" [scale="Fahrenheit"]}
 * String FooMode           "Foo Mode"            {alexa="ThermostatController.thermostatMode" [OFF=0,HEAT=1,COOL=2,AUTO=3]}
 * Switch FooSwitch         "FooSwitch"           {alexa="PowerController.powerState"}
 *
 * returns
 *
  * propertyMap:
  *  {
  *    ThermostatController: {
  *      targetSetpoint: {
  *          itemName: "FooTargetSetPoint",
  *          parameters: {
  *            scale: "Fahrenheit",
  *         }
  *      },
  *      upperSetpoint: {
  *          itemName: "FooTargetSetPoint",
  *          parameters: {
  *            scale: "Fahrenheit",
  *         }
  *      },
  *      lowerSetpoint: {
  *          itemName: "FooTargetSetPoint",
  *          parameters: {
  *            scale: "Fahrenheit",
  *         }
  *      },
  *      thermostatMode: {
  *          itemName: "FooMode",
  *          parameters: {
  *            OFF: 0,
  *            HEAT: 1,
  *            COOL: 2,
  *            AUTO: 3
  *         }
  *      }
  *    },
  *    PowerController: {
  *      powerState: {
  *         itemName: "FooSwitch"
  *       }
  *    }
 * @param {object} item
 * @param {object} propertyMap
 */
function metadataToPropertyMap(item, propertyMap = {}) {
  item.metadata.alexa.value.split(',').forEach(function(capability) {
    var matches;
    if (matches = capability.match(CAPABILITY_PATTERN)) {
      var interfaceName = matches[1];
      var propertyName = matches[2];
      var properties = propertyMap[interfaceName] || {};
      var config = item.metadata.alexa.config || {};
      var categories = properties.categories || [];

      // Extract category from metadata config and store remaining parameters
      var parameters = Object.keys(config).reduce(function(parameters, key) {
        if (key === 'category') {
          var category = config.category.toUpperCase();
          if (!categories.includes(category) && supportedDisplayCategory(category)) {
            categories.push(category);
          }
        } else {
          parameters[key] = config[key];
        }
        return parameters;
      }, {});

      // Add property to map object
      propertyMap[interfaceName] = Object.assign(properties, {
        [propertyName]: {
          parameters: parameters,
          itemName: item.name
        }
      });
      // Update interface categories if not empty
      if (categories.length) {
        propertyMap[interfaceName].categories = categories;
      }
    }
  });
  return propertyMap;
}

module.exports.date = date;
module.exports.metadataToPropertyMap = metadataToPropertyMap;
module.exports.normalizeColorTemperature = normalizeColorTemperature;
module.exports.normalizeThermostatMode = normalizeThermostatMode;
module.exports.supportedDisplayCategory = supportedDisplayCategory;
