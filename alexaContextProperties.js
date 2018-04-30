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
 * Returns a property response for power endpoints
 * @param {*} state
 */
AlexaContextProperties.prototype.powerStateProperty = function (state) {
  // Extract brightness level from color item state
  if (state.split(',').length == 3) {
    state = state.split(',').pop();
  }
  if (!isNaN(state)) {
    var num = parseInt(state);
    state = num > 0 ? "ON" : "OFF"
  }
  return this.generateProperty('Alexa.PowerController', 'powerState', state);
}

/**
 * Returns a property response for percentage endpoints
 * @param {*} state
 */
AlexaContextProperties.prototype.percentageStateProperty = function (state) {
  // Extract brightness level from color item state
  if (state.split(',').length == 3) {
    state = state.split(',').pop();
  }
  if (isNaN(state)) {
    state = state === "ON" ? 100 : 0;
  }
  return this.generateProperty('Alexa.PercentageController', 'percentage', parseInt(state));
}

/**
 * Returns a property response for brightness endpoints
 * @param {*} state
 */
AlexaContextProperties.prototype.brightnessStateProperty = function (state) {
  // Extract brightness level from color item state
  if (state.split(',').length == 3) {
    state = state.split(',').pop();
  }
  if (isNaN(state)) {
    state = state === "ON" ? 100 : 0;
  }
  return this.generateProperty('Alexa.BrightnessController', 'brightness', parseInt(state));
}

/**
 * Returns a property response for power level endpoints
 * @param {*} state
 */
AlexaContextProperties.prototype.powerLevelStateProperty = function (state) {
  if (isNaN(state)) {
    state = state === "ON" ? 100 : 0;
  }
  return this.generateProperty('Alexa.PowerLevelController', 'powerLevel', parseInt(state));
}

/**
 * Returns a property response for color endpoints
 * @param {string} state
 */
AlexaContextProperties.prototype.colorStateProperty = function (state) {
  var hsb = state.split(',');
  var h =  parseFloat(hsb[0]);
  var s =  parseFloat(hsb[1]);
  var b =  parseFloat(hsb[2]);
  if(s > 0){
    s = s / 100.0;
  }
  if(b > 0){
    b = b / 100.0;
  }
  return this.generateProperty('Alexa.ColorController', 'color', {
    hue: h,
    saturation: s,
    brightness: b
  });
}

/**
 * Returns a property response for color temperature ndpoints
 * @param {integer} state
 * @param {string} type
 */
AlexaContextProperties.prototype.colorTemperatureStateProperty = function (state, type) {
  state = utils.normalizeColorTemperature(state, type);
  return this.generateProperty('Alexa.ColorTemperatureController', 'colorTemperatureInKelvin', parseInt(state));
}

/**
 * Returns a property response for targetSetpoint endpoints
 * @param {float} state
 * @param {string} scale
 */
AlexaContextProperties.prototype.targetSetpointStateProperty = function (state, scale) {
  return this.generateProperty('Alexa.ThermostatController', 'targetSetpoint', {
    value: parseFloat(state),
    scale: scale
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
 * @param {string} state
 */
AlexaContextProperties.prototype.thermostatModeStateProperty = function (state) {
  return this.generateProperty('Alexa.ThermostatController', 'thermostatMode', {
    value: state
  });
}

/**
 * Returns a property response for temperature sensor endpoints
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
 * Returns a property response for lock endpoints
 * @param {string} state
 */
AlexaContextProperties.prototype.lockStateProperty = function (state) {
  var locked = state === "ON" ? "LOCKED" : state === "OFF" ? "UNLOCKED" : "JAMMED";
  return this.generateProperty('Alexa.LockController', 'lockState', locked);
}

/**
 * Returns a property response for channel endpoints
 * @param {string} state
 */
AlexaContextProperties.prototype.channelStateProperty = function (state) {
  return this.generateProperty('Alexa.ChannelController', 'channel', {
    number: state
  });
}

/**
 * Returns a property response for input endpoints
 * @param {string} state
 */
AlexaContextProperties.prototype.inputStateProperty = function (state) {
  return this.generateProperty('Alexa.InputController', 'input', state);
}


/**
 * Returns a property response for speaker muted endpoints
 * @param {string} state
 */
AlexaContextProperties.prototype.speakerMutedStateProperty = function (state) {
  var muted = state === "ON" ? true : false;
  return this.generateProperty('Alexa.Speaker', 'muted', muted);
}

/**
 * Returns a property response for speaker volume endpoints
 * @param {integer} state
 */
AlexaContextProperties.prototype.speakerVolumeStateProperty = function (state) {
  return this.generateProperty('Alexa.Speaker', 'volume', parseInt(state));
}

/**
 * Returns a property response for health endpoints
 */
AlexaContextProperties.prototype.endpointHealthProperty = function () {
  return this.generateProperty('Alexa.EndpointHealth', 'connectivity', {
    value: "OK"
  });
}

/**
 * Generate property response
 * @param {string} namespace
 * @param {string} name
 * @param {*} value
 */
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
    return items.find(item => item.name === itemName);
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
          properties.push(self.powerLevelStateProperty(item.state));
        }
        break;
      case "BrightnessController":
        item = itemByName(group.brightness.itemName);
        if (item) {
          properties.push(self.brightnessStateProperty(item.state));
        }
        break;
      case "PercentageController":
        item = itemByName(group.percentage.itemName);
        if (item) {
          properties.push(self.percentageStateProperty(item.state));
        }
        break;
      case "ColorController": //Color [Lighting]
        item = itemByName(group.color.itemName);
        if (item) {
          properties.push(self.colorStateProperty(item.state));
        }
        break;
      case "ColorTemperatureController": //Dimmer or Number
        item = itemByName(group.colorTemperatureInKelvin.itemName);
        if(item){
          properties.push(self.colorTemperatureStateProperty(item.state, item.type));
        }
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
            var scale = group.upperSetpoint.parameters.scale ?
              group.upperSetpoint.parameters.scale.toUpperCase() : "CELSIUS";
            properties.push(self.upperSetpointStateProperty(item.state, scale));
          }
        }
        if (group.lowerSetpoint) {
          item = itemByName(group.lowerSetpoint.itemName);
          if (item) {
            var scale = group.lowerSetpoint.parameters.scale ?
              group.lowerSetpoint.parameters.scale.toUpperCase() : "CELSIUS";
            properties.push(self.lowerSetpointStateProperty(item.state, scale));
          }
        }
        if (group.thermostatMode) {
          item = itemByName(group.thermostatMode.itemName);
          if (item) {
            var state = utils.normalizeThermostatMode(item.state, group.thermostatMode.parameters);
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
      case "ChannelController": //Number [Alexa@Channel]
        item = itemByName(group.channel.itemName);
        if (item){
          properties.push(self.channelStateProperty(item.state));
        }
        break;
      case "InputController": //String [Alexa@Input]
        item = itemByName(group.input.itemName);
        if(item){
          properties.push(self.inputStateProperty(item.state));
        }
        break;
      case "PlaybackController": //Player or Group? [Alexa@Player]
        break;
      case "SceneController": //Switch ? [Scene]
        break;
      case "Speaker": //Group ? (volume dimmer, mute switch) [Alexa@Speaker]
        if (group.muted) {
          item = itemByName(group.muted.itemName);
          if(item){
            properties.push(self.speakerMutedStateProperty(item.state));
          }
        }
        if (group.volume) {
          item = itemByName(group.volume.itemName);
          if(item){
            properties.push(self.speakerVolumeStateProperty(item.state));
          }
        }
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
