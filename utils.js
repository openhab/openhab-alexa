/**
 * Copyright (c) 2014-2016 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

var TAG_PATTERN =  /^Alexa\.(\w+)\.(\w+)(?::(.+))?/;
/**
 * Convert C to F
 */
function toF(value) {
    return Math.round(value * 9 / 5 + 32);
}
/**
 * Convert F to C
 */
function toC(value) {
    return ((value - 32) * 5 / 9).toFixed(2);
}

function generateControlError(messageId, name, code, description) {
    var header = {
        namespace: 'Alexa.ConnectedHome.Control',
        name: name,
        payloadVersion: '2',
        messageId: messageId
    };

    var payload = {
        exception: {
            code: code,
            description: description
        }
    };

    var result = {
        header: header,
        payload: payload
    };

    return result;
}

/**
* Normilizes numeric/string thermostat modes to Alexa friendly ones
**/
function normalizeThermostatMode(mode){
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

function isEventFahrenheit(event){
  return event.payload.appliance.additionalApplianceDetails.temperatureFormat &&
  event.payload.appliance.additionalApplianceDetails.temperatureFormat === 'fahrenheit';
}

function generateResponseHeader(header){
  return {
    messageId: header.messageId,
    name: "Response",
    namespace: header.namespace,
    payloadVersion: header.payloadVersion
  };
}

function date() {
  var d = new Date();
  return d.toISOString();
}

/**
 * Creates/Modifies a map structure to assoicate items to an endpoint from Alexa cookies
 * eg:
 * 
 * cookie: {
 *  "Alexa.ThermostatController.targetSetpoint" : "FooTargetSetPoint"
 *  "Alexa.ThermostatController.upperSetpoint" : "FooUpperSetPoint
 *  "Alexa.ThermostatController.lowerSetpoint" : "FooLowerSetPoint"
 *  "Alexa.PowerController.powerState" : "FooSwitch"
 * }
 * 
 * returns:
 * 
 * propertyMap:
 *  {
 *    ThermostatController : {
 *      targetSetpoint : "FooTargetSetPoint",
 *      upperSetpoint : "FooUpperSetPoint",
 *      lowerSetpoint : "FooLowerSetPoint",
 *    },
 *    PowerController : {
 *      powerState : "FooSwitch"
 *    }
 *    
 *  }
 * @param {object} cookies 
 */
function cookiesToPropertyMap(cookies) {
    var propertyMap = {}
    Object.keys(cookies).forEach(function (key) {
      var matches;
      //eg. Alex.ThermostatController.targetSetpoint
      if ((matches = TAG_PATTERN.exec(key)) !== null) {
        var itemName = cookies[key];
        var groupName = matches[1];
        var property = matches[2];
        if (!propertyMap[groupName]) {
          propertyMap[groupName] = {};
        }
        propertyMap[groupName][property] = itemName;
      }
    });
    return propertyMap;
  }
  
  /**
   * Creates/Modifies a map structure to assoicate items to an endpoint from tags, will return a new map
   * if propertyMap is omitted or null, otherwise will modify the existing map (and return it as well)
   * eg:
   * 
   * OH Tags
   * 
   * Number FooTargetSetPoint "Foo Target SetPoint" ["Alexa.ThermostatController.targetSetpoint"]
   * Number FooUpperSetPoint  "Foo Upper SetPoint"  ["Alexa.ThermostatController.upperSetpoint"]
   * Number FooLowerSetPoint  "Foo Lower SetPoint"  ["Alexa.ThermostatController.lowerSetpoint"]
   * Switch FooSwitch         "FooSwitch"           ["Alexa.PowerController.powerState"]
   * 
   * returns
   * 
   * propertyMap:
   *  {
   *    ThermostatController : {
   *      targetSetpoint : "FooTargetSetPoint",
   *      upperSetpoint : "FooUpperSetPoint",
   *      lowerSetpoint : "FooLowerSetPoint",
   *    },
   *    PowerController : {
   *      powerState : "FooSwitch"
   *    }
   *    
   *  }
   * @param {String} item 
   * @param {object} propertyMap 
   */
  function tagsToPropertyMap(item, propertyMap) {
    if(!propertyMap){
      propertyMap = {}
    }
    item.tags.forEach(function (tag) {
      var matches;
      if ((matches = TAG_PATTERN.exec(tag)) !== null) {
        var groupName = matches[1];
        var property = matches[2];
        if (!propertyMap[groupName]) {
          propertyMap[groupName] = {};
        }
        propertyMap[groupName][property] = item.name;
      }
    });
    return propertyMap;
  }
  
module.exports.toF = toF;
module.exports.toC = toC;
module.exports.generateControlError = generateControlError;
module.exports.normalizeThermostatMode = normalizeThermostatMode;
module.exports.isEventFahrenheit = isEventFahrenheit;
module.exports.date = date;
module.exports.cookiesToPropertyMap = cookiesToPropertyMap;
module.exports.tagsToPropertyMap = tagsToPropertyMap;
