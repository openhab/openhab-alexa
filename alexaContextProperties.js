/*
* Copyright (c) 2014-2018 by the respective copyright holders.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*/

/**
* Amazon Smart Home Skill Context Properties for API V3
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
 * Returns a property response for color temperature endpoints
 * @param {integer} state
 */
AlexaContextProperties.prototype.colorTemperatureStateProperty = function (state) {
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
  return this.generateProperty('Alexa.LockController', 'lockState', state);
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
 * Given an array of capability interfaces and Alexa property map object, generate a property response list
 *
 * @param {array} interfaceNames
 * @param {object} propertyMap
 */
AlexaContextProperties.prototype.propertiesResponseForInterfaces = function (interfaceNames, propertyMap) {
  var self = this;
  var response = [];

  interfaceNames.forEach(function (interfaceName) {
    var properties = propertyMap[interfaceName];
    switch (interfaceName) {
      case "PowerController": //Switch, Dimmer [Switchable]
        var item = properties.powerState.item;
        response.push(self.powerStateProperty(item.state));
        break;
      case "PowerLevelController": //Dimmer or Number, Rollershutter [Lighting]
        var item = properties.powerLevel.item;
        response.push(self.powerLevelStateProperty(item.state));
        break;
      case "BrightnessController":
        var item = properties.brightness.item;
        response.push(self.brightnessStateProperty(item.state));
        break;
      case "PercentageController":
        var item = properties.percentage.item;
        response.push(self.percentageStateProperty(item.state));
        break;
      case "ColorController": //Color [Lighting]
        var item = properties.color.item;
        response.push(self.colorStateProperty(item.state));
        break;
      case "ColorTemperatureController": //Dimmer or Number
        var item = properties.colorTemperatureInKelvin.item;
        var state = utils.normalizeColorTemperature(item.state, item.type);
        response.push(self.colorTemperatureStateProperty(state));
        break;
      case "ThermostatController": //Group [Thermostat]
        if (properties.targetSetpoint) {
          var item = properties.targetSetpoint.item;
          var scale = properties.targetSetpoint.parameters.scale ?
            properties.targetSetpoint.parameters.scale.toUpperCase() : "CELSIUS";
          response.push(self.targetSetpointStateProperty(item.state, scale));
        }
        if (properties.upperSetpoint) {
          var item = properties.upperSetpoint.item;
          var scale = properties.upperSetpoint.parameters.scale ?
            properties.upperSetpoint.parameters.scale.toUpperCase() : "CELSIUS";
          response.push(self.upperSetpointStateProperty(item.state, scale));
        }
        if (properties.lowerSetpoint) {
          var item = properties.lowerSetpoint.item;
          var scale = properties.lowerSetpoint.parameters.scale ?
            properties.lowerSetpoint.parameters.scale.toUpperCase() : "CELSIUS";
          response.push(self.lowerSetpointStateProperty(item.state, scale));
        }
        if (properties.thermostatMode) {
          var item = properties.thermostatMode.item;
          var state = utils.normalizeThermostatMode(item.state, properties.thermostatMode.parameters);
          response.push(self.thermostatModeStateProperty(state));
        }
        break;
      case "TemperatureSensor":
        var item = properties.temperature.item;
        var scale = properties.temperature.parameters.scale ?
          properties.temperature.parameters.scale.toUpperCase() : "CELSIUS";
        response.push(self.temperatureSensorStateProperty(item.state, scale));
        break;
      case "LockController": //Switch [Lock]
        var item = properties.lockState.item;
        var state = utils.normalizeLockState(item.state, item.type, properties.lockState.parameters);
        response.push(self.lockStateProperty(state));
        break;
      case "ChannelController": //Number [Alexa@Channel]
        var item = properties.channel.item;
        response.push(self.channelStateProperty(item.state));
        break;
      case "InputController": //String [Alexa@Input]
        var item = properties.input.item;
        response.push(self.inputStateProperty(item.state));
        break;
      case "PlaybackController": //Player or Group? [Alexa@Player]
        break;
      case "SceneController": //Switch ? [Scene]
        break;
      case "Speaker": //Group ? (volume dimmer, mute switch) [Alexa@Speaker]
        if (properties.muted) {
          var item = properties.muted.item;
          response.push(self.speakerMutedStateProperty(item.state));
        }
        if (properties.volume) {
          var item = properties.volume.item;
          response.push(self.speakerVolumeStateProperty(item.state));
        }
        break;
      case "StepSpeaker": //Group ? (steup string, mute, not really sure) [Alexa@StepSpeaker]
        break;
      case "CameraStreamController":  //not supported.
        break;
      default:
    }
  });

  response.push(this.endpointHealthProperty());

  return response;
}
module.exports = new AlexaContextProperties();
