/*
* Copyright (c) 2014-2016 by the respective copyright holders.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*/

/**
* Amazon Smart Home Skill Controller Properties for API V3
*/
var utils = require('./utils.js');

var AlexaContextProperties = function () {
};

/**
 * 
 * @param {*} state 
 */
AlexaContextProperties.prototype.powerStateProperty = function (state) {
  if (!isNaN(state)) {
    var num = parseInt(state);
    state = num > 0 ? 'ON' : 'OFF'
  }
  return this.generateProperty('Alexa.PowerController', 'powerState', state);
}

/*
* Returns a property response for percentage endpoints
* @param {*} state 
*/
AlexaContextProperties.prototype.percentageStateProperty = function (state) {
  if (isNaN(state)) {
    state = state == "ON" ? 100 : 0;
  }
  return this.generateProperty('Alexa.PercentageController', 'percentage', state);
}

/**
 * Returns a property response for brightness endpoints
 * @param {*} state 
 */
AlexaContextProperties.prototype.brightnessStateProperty = function (state) {
  if (isNaN(state)) {
    state = state == "ON" ? 100 : 0;
  }
  return this.generateProperty('Alexa.BrightnessController', 'brightness', state);
}

/**
 * Returns a property response for power level endpoints
 * @param {*} state 
 */
AlexaContextProperties.prototype.powerLevelStateProperty = function (state) {
  if (isNaN(state)) {
    state = state == "ON" ? 100 : 0;
  }
  return this.generateProperty('Alexa.PowerLevelController', 'powerLevel', state);
}

/**
 * Returns a property response for color endpoints
 * @param {*} state 
 */
AlexaContextProperties.prototype.colorStateProperty = function (state) {
  var hsb = state.split(',');
  return this.generateProperty('Alexa.ColorController', 'color', {
    hue: parseInt(hsb[0]),
    brightness: parseInt(hsb[1]),
    saturation: parseInt(hsb[2])
  });
}


/**
 * Returns a property response for targetSetpoint endpoints
 * @param {float} state 
 * @param {string} scale 
 */
AlexaContextProperties.prototype.targetSetpointStateProperty = function (state, scale) {
  return this.generateProperty('Alexa.ThermostatController', 'targetSetpoint', {
    value: state,
    scale: parseFloat(scale)
  });
}

/**
 * Returns a property response for lowerSetpoint endpoints
 * @param {float} state 
 * @param {string} scale 
 */
AlexaContextProperties.prototype.lowerSetpointStateProperty = function (state, scale) {
  return this.generateProperty('Alexa.ThermostatController', 'lowerSetpoint', {
    value: parseFloat(state),
    scale: scale
  });
}
/**
 * Returns a property response for upperSetpoint endpoints
 * @param {float} state 
 * @param {string} scale 
 */
AlexaContextProperties.prototype.upperSetpointStateProperty = function (state, scale) {
  return this.generateProperty('Alexa.ThermostatController', 'upperSetpoint', {
    value: parseFloat(state),
    scale: scale
  });
}
/**
 * Returns a property response for thermostatMode endpoints
 * @param {float} state 
 */
AlexaContextProperties.prototype.thermostatModeStateProperty = function (state) {
  return this.generateProperty('Alexa.ThermostatController', 'thermostatMode', state);
}

/**
 * Returns a property response for temperature sensor  endpoints
 * @param {float} state
 * @param {string} scale  
 */
AlexaContextProperties.prototype.temperatureSensorStateProperty = function (state, scale) {
  return this.generateProperty('Alexa.TemperatureSensor', 'temperature', {
    value: parseFloat(state),
    scale: scale
  });
}

/**
* 
* @param {*} state 
*/
AlexaContextProperties.prototype.lockStateProperty = function (state) {
  var locked = state == 'ON' ? "LOCKED" : "UNLOCKED";
  return this.generateProperty('Alexa.LockController', 'lockState', state);
}

/**
* 
* @param {*} state 
*/
AlexaContextProperties.prototype.endpointHealthProperty = function () {
  return this.generateProperty('Alexa.EndpointHealth', 'connectivity', {
    value: "OK"
  });
}

AlexaContextProperties.prototype.generateProperty = function (namespace, name, value) {
  return {
    namespace: namespace,
    name: name,
    value: value,
    timeOfSample: utils.date(),
    uncertaintyInMilliseconds: 0
  }
}

/**
 * Given an array of items (name,state only) and a Alexa cookies object, generate a property response for all 
 * endpoints listed in the propertyMap
 *  
 * @param {array} items 
 * @param {object} propertyMap 
 */
AlexaContextProperties.prototype.propertiesResponseForItems = function (items, propertyMap) {
  var self = this;
  var properties = [];

  function itemByName(itemName) {
    if (!itemName) {
      return null;
    }
    return items.find(function (i) {
      return i.name == itemName;
    });
  }

  Object.keys(propertyMap).forEach(function (groupName) {
    var item;
    var group = propertyMap[groupName];
    switch (groupName) {
      case "PowerController": //Switch, Dimmer [Switchable]
        item = itemByName(group.powerState.itemName);
        if (item) {
          properties.push(self.powerStateProperty(item.state));
        }
        break;
      case "PowerLevelController": //Dimmer or Number, Rollershutter [Lighting]
        item = itemByName(group.powerLevel.itemName);
        if (item) {
          properties.push(self.powerLevelStateProperty(parseInt(item.state)));
        }
        break;
      case "BrightnessController":
        item = itemByName(group.brightness.itemName);
        if (item) {
          properties.push(self.brightnessStateProperty(parseInt(item.state)));
        }
        break;
      case "PercentageController":
        item = itemByName(group.percentage.itemName);
        if (item) {
          properties.push(self.percentageStateProperty(parseInt(item.state)));
        }
        break;
      case "ColorController": //Color [Lighting]
        item = itemByName(group.color.itemName);
        if (item) {
          properties.push(self.colorStateProperty(item.state));
        }
        break;
      case "ColorTemperatureController": //Dimmer
        break;
      case "ChannelController":
        break;
      case "ThermostatController": //Group [Thermostat]
        if (group.targetSetpoint) {
          item = itemByName(group.targetSetpoint.itemName);
          if (item) {
            var scale = group.targetSetpoint.parameters.scale ?
              group.targetSetpoint.parameters.scale.toUpperCase() : "CELSIUS";
            properties.push(self.targetSetpointStateProperty(item.state, scale));
          }
        }
        if (group.upperSetpoint) {
          item = itemByName(group.upperSetpoint.itemName);
          if (item) {
            scale = group.upperSetpoint.parameters.scale ?
              group.upperSetpoint.parameters.scale.toUpperCase() : "CELSIUS";
            properties.push(self.upperSetpointStateProperty(item.state, scale));
          }
        }
        if (group.lowerSetpoint) {
          item = itemByName(group.lowerSetpoint.itemName);
          if (item) {
            scale = group.lowerSetpoint.parameters.scale ?
              group.lowerSetpoint.parameters.scale.toUpperCase() : "CELSIUS";
            properties.push(self.lowerSetpointStateProperty(item.state, scale));
          }
        }
        if (group.thermostatMode) {
          item = itemByName(group.thermostatMode.itemName);
          if (item) {
            var state = item.state;
            ['OFF','HEAT','COOL','AUTO'].forEach(function(mode){
              var mappedMode = group.thermostatMode.parameters[mode];
              if(mappedMode === item.state.toString()){
                state = mode;
                return; //returns forEach
              }
            });
            properties.push(self.thermostatModeStateProperty(state));
          }
        }
        break;
      case "TemperatureSensor":
        item = itemByName(group.temperature.itemName);
        if (item) {
          var scale = group.temperature.parameters.scale ?
            group.temperature.parameters.scale.toUpperCase() : "CELSIUS";
          properties.push(self.temperatureSensorStateProperty(item.state, scale));
        }
        break;
      case "LockController": //Switch [Lock]
        item = itemByName(group.lockState.itemName);
        if (item) {
          properties.push(self.lockStateProperty(item.state));
        }
        break;
      case "InputController": //String [Alexa@Input]
        break;
      case "PlaybackController": //Player or Group? [Alexa@Player]
        break;
      case "SceneController": //Switch ? [Scene]
        break;
      case "Speaker": //Group ? (volume dimmer, mute switch) [Alexa@Speaker]
        break;
      case "StepSpeaker": //Group ? (steup string, mute, not really sure) [Alexa@StepSpeaker]
        break;
      case "CameraStreamController":  //not supported.
        break;
      default:
    }
  });

  properties.push(this.endpointHealthProperty());

  return properties;
}
module.exports = new AlexaContextProperties();