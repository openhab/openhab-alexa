/**
 * Copyright (c) 2014-2016 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

var TAG_PATTERN = /^Alexa\.(\w+)\.(\w+)(?::(\S+))?/;

/**
* Normilizes numeric/string thermostat modes to Alexa friendly ones
**/
function normalizeThermostatMode(mode) {
  //if state returns as a decimal type, convert to string, this is a very common thermo pattern
  var m = mode;
  switch (mode) {
    case '0': //off, not supported! Weird. But nothing else todo.
      m = 'OFF';
      break;
    case '1': //heating
      m = 'HEAT';
      break;
    case '2': //cooling
      m = 'COOL';
      break;
    case 'heat-cool': //nest auto
    case '3': //auto
      m = 'AUTO';
      break;
  }
  return m.toUpperCase();
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

function date() {
  var d = new Date();
  return d.toISOString();
}

/**
 * Creates/Modifies a map structure to assoicate items to an endpoint from tags, will return a new map
 * if propertyMap is omitted or null, otherwise will modify the existing map (and return it as well)
 * eg:
 *
 * OH Tags
 *
 * Number FooTargetSetPoint "Foo Target SetPoint" ["Alexa.ThermostatController.targetSetpoint:scale=Fahrenheit"]
 * Number FooUpperSetPoint  "Foo Upper SetPoint"  ["Alexa.ThermostatController.upperSetpoint:scale=Fahrenheit"]
 * Number FooLowerSetPoint  "Foo Lower SetPoint"  ["Alexa.ThermostatController.lowerSetpoint:scale=Fahrenheit"]
 * String FooMode           "Foo Mode"            ["Alexa.ThermostatController.thermostatMode:OFF=0,HEAT=1,COOL=2,AUTO=3"
 * Switch FooSwitch         "FooSwitch"           ["Alexa.PowerController.powerState"]
 *
 * returns
 *
  * propertyMap:
  *  {
  *    ThermostatController : {
  *      targetSetpoint : {
  *          itemName: "FooTargetSetPoint",
  *          parameters: {
  *            scale : "Fahrenheit",
  *         }
  *      },
  *      upperSetpoint : {
  *          itemName: "FooTargetSetPoint",
  *          parameters: {
  *            scale : "Fahrenheit",
  *         }
  *      },
  *      lowerSetpoint : {
  *          itemName: "FooTargetSetPoint",
  *          parameters: {
  *            scale : "Fahrenheit",
  *         }
  *      },
  *      thermostatMode : {
  *          itemName: "FooMode",
  *          parameters: {
  *            OFF : "0",
  *            HEAT : "1",
  *            COOL : "2",
  *            AUTO : "3"
  *         }
  *      }
  *    },
  *    PowerController : {
  *      powerState : {
  *         itemName: "FooSwitch"
  *       }
  *    }
 * @param {String} item
 * @param {object} propertyMap
 */
function tagsToPropertyMap(item, propertyMap) {
  if (!propertyMap) {
    propertyMap = {}
  }
  item.tags.forEach(function (tag) {
    var matches;
    if ((matches = TAG_PATTERN.exec(tag)) !== null) {
      var interfaceName = matches[1];
      var property = matches[2];
      var parameters = matches[3];

      if (!propertyMap[interfaceName]) {
        propertyMap[interfaceName] = {};
      }
      propertyMap[interfaceName][property] = {};
      propertyMap[interfaceName][property].parameters = {};
      propertyMap[interfaceName][property].itemName = item.name;
      if (parameters) {
        var params = parameters.split(",");
        params.forEach(function (param) {
          var keyValue = param.split("=");
          if (keyValue.length == 2) {
            //if a tag has a category parameter add this to the interface instead of the property
            if(keyValue[0] == 'category'){
              if(!propertyMap[interfaceName].categories){
                propertyMap[interfaceName].categories = [];
              }
              propertyMap[interfaceName].categories.push(keyValue[1].toUpperCase());
            } else {
              propertyMap[interfaceName][property].parameters[keyValue[0]] = keyValue[1];
            }
          }
        });
      }
    }
  });
  return propertyMap;
}

module.exports.normalizeThermostatMode = normalizeThermostatMode;
module.exports.normalizeColorTemperature = normalizeColorTemperature;
module.exports.date = date;
module.exports.tagsToPropertyMap = tagsToPropertyMap;
