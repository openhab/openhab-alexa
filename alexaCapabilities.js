/**
 * Copyright (c) 2014-2016 by the respective copyright holders.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 */

/**
 * Amazon Smart Home Skill Capabilities Interfaces for API V3
 */

var AlexaCapabilities = function () {
};

AlexaCapabilities.prototype.alexa = function () {
  return {
    "type": "AlexaInterface",
    "interface": "Alexa",
    "version": "3"
  }
}

AlexaCapabilities.prototype.powerController = function (name) {
  var itemMap = {};
  itemMap["Alexa.PowerController.powerState"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.PowerController",
      "version": "3",
      "properties": {
        "supported": [{
          "name": "powerState"
        }],
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "SWITCH",
    itemMap: itemMap
  };
};


AlexaCapabilities.prototype.brightnessController = function (name) {
  var itemMap = {};
  itemMap["Alexa.BrightnessController.brightness"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.BrightnessController",
      "version": "3",
      "properties": {
        "supported": [{
          "name": "brightness"
        }],
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "LIGHT",
    itemMap: itemMap
  };
};

AlexaCapabilities.prototype.powerLevelController = function (name) {
  var itemMap = {};
  itemMap["Alexa.PowerLevelController.powerLevel"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.PowerLevelController",
      "version": "3",
      "properties": {
        "supported": [{
          "name": "powerLevel"
        }],
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "OTHER",
    itemMap: itemMap
  };
};

AlexaCapabilities.prototype.percentageController = function (name) {
  var itemMap = {};
  itemMap["Alexa.PercentageController.percentage"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.PercentageController",
      "version": "3",
      "properties": {
        "supported": [{
          "name": "percentage"
        }],
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "OTHER",
    itemMap: itemMap
  };
};

AlexaCapabilities.prototype.thermostatController = function (targetSetpointName, upperSetpointName, lowerSetpointName, thermostatModeName) {
  var itemMap = {};
  var supported = [];
  if (targetSetpointName) {
    itemMap["Alexa.ThermostatController.targetSetpoint"] = targetSetpointName;
    supported.push({
      "name": "targetSetpoint"
    })
  }
  if (upperSetpointName) {
    itemMap["Alexa.ThermostatController.upperSetpoint"] = upperSetpointName;
    supported.push({
      "name": "upperSetpoint"
    })
  }
  if (lowerSetpointName) {
    itemMap["Alexa.ThermostatController.lowerSetpoint"] = lowerSetpointName;
    supported.push({
      "name": "lowerSetpoint"
    })
  }
  if (thermostatModeName) {
    itemMap["Alexa.ThermostatController.thermostatMode"] = thermostatModeName;
    supported.push({
      "name": "thermostatMode"
    })
  }
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.ThermostatController",
      "version": "3",
      "properties": {
        "supported": supported,
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "THERMOSTAT",
    itemMap: itemMap
  };
};


AlexaCapabilities.prototype.temperatureSensor = function (name) {
  var itemMap = {};
  itemMap["Alexa.TemperatureSensor.temperature"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.TemperatureSensor",
      "version": "3",
      "properties": {
        "supported": [{
          "name": "temperature"
        }],
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "TEMPERATURE_SENSOR",
    itemMap: itemMap
  };
};

AlexaCapabilities.prototype.lockController = function (name) {
  var itemMap = {};
  itemMap["Alexa.LockController.lockState"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.LockController",
      "version": "3",
      "properties": {
        "supported": [{
          "name": "lockState"
        }],
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "SMARTLOCK",
    itemMap: itemMap
  };
};

AlexaCapabilities.prototype.colorController = function (name) {
  var itemMap = {};
  itemMap["Alexa.ColorController.color"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.ColorController",
      "version": "3",
      "properties": {
        "supported": [{
          "name": "color"
        }],
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "LIGHT",
    itemMap: itemMap
  };
};

AlexaCapabilities.prototype.colorTemperatureController = function () {
  var itemMap = {};
  itemMap["Alexa.ColorTemperatureController.colorTemperatureInKelvin"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.ColorTemperatureController",
      "version": "3",
      "properties": {
        "supported": [{
          "name": "colorTemperatureInKelvin"
        }],
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "LIGHT",
    itemMap: itemMap
  };
};

AlexaCapabilities.prototype.sceneController = function () {
  var itemMap = {};
  itemMap["Alexa.SceneController.scene"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.SceneController",
      "version": "3",
      "supportsDeactivation": false,
      "proactivelyReported": false
    },
    catagory: "SCENE_TRIGGER",
    itemMap: itemMap
  };

};

/**
 * Not implemented yet!!!
 * @param {} protocol 
 * @param {*} width 
 * @param {*} height 
 * @param {*} authType 
 * @param {*} videoCodec 
 * @param {*} audioCodec 
 */
AlexaCapabilities.prototype.cameraStreamController = function (protocol, width, height, authType, videoCodec, audioCodec) {
  var itemMap = {};
  itemMap["Alexa.CameraStreamController.resolutions"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.CameraStreamController",
      "version": "3",
      "cameraStreamConfigurations": [{
        "protocols": [
          protocol
        ],
        "resolutions": [{
          "width": width,
          "height": height
        }],
        "authorizationTypes": [
          authType
        ],
        "videoCodecs": [
          videoCodec
        ],
        "audioCodecs": [
          audioCodec
        ]
      }]
    },
    catagory: "CAMERA",
    itemMap: itemMap
  };
};

/**
 * Not implemented yet!
 * @param {*} name 
 */
AlexaCapabilities.prototype.channelController = function (name) {
  var itemMap = {};
  itemMap["Alexa.ChannelController.channel"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.ChannelController",
      "version": "3",
      "properties": {
        "supported": [
          {
            "name": "channel"
          }
        ],
        "proactivelyReported": true,
        "retrievable": true
      }
    },
    catagory: "TV",
    itemMap: itemMap
  }
}

AlexaCapabilities.prototype.inputController = function (name) {
  var itemMap = {};
  itemMap["Alexa.InputController.input"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.InputController",
      "version": "3",
      "properties": {
        "supported": [
          {
            "name": "input"
          }
        ],
        "proactivelyReported": true,
        "retrievable": true
      }
    },
    catagory: "ACTIVITY_TRIGGER",
    itemMap: itemMap
  }
}

AlexaCapabilities.prototype.speaker = function (volumeName, mutedName) {
  var itemMap = {};
  var supported = [];
  if (volumeName) {
    itemMap["Alexa.Speaker.volume"] = volumeName;
    supported.push({
      "name": "volume"
    })
  }
  if (mutedName) {
    itemMap["Alexa.Speaker.mute"] = mutedName;
    supported.push({
      "name": "mute"
    })
  }
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.Speaker",
      "version": "3",
      "properties": {
        "supported": supported,
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "SPEAKER",
    itemMap: itemMap
  };
};

AlexaCapabilities.prototype.stepSpeaker = function (volumeName, mutedName) {
  var itemMap = {};
  var supported = [];
  if (volumeName) {
    itemMap["Alexa.StepSpeaker.volume"] = volumeName;
    supported.push({
      "name": "volume"
    })
  }
  if (mutedName) {
    itemMap["Alexa.StepSpeaker.mute"] = mutedName;
    supported.push({
      "name": "mute"
    })
  }
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.StepSpeaker",
      "version": "3",
      "properties": {
        "supported": supported,
        "proactivelyReported": false,
        "retrievable": true
      }
    },
    catagory: "SPEAKER",
    itemMap: itemMap
  };
};

AlexaCapabilities.prototype.playbackController = function () {
  var itemMap = {};
  itemMap["Alexa.PlaybackController.playback"] = name;
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.PlaybackController",
      "version": "3",
      "proactivelyReported": false,
      "supportedOperations": ["Play", "Pause", "Next", "Previous", "Rewind", "FastForward", "Stop"]
    },
    catagory: "OTHER",
    itemMap: itemMap
  };

};

AlexaCapabilities.prototype.endpointHealth = function () {
  return {
    "type": "AlexaInterface",
    "interface": "Alexa.EndpointHealth",
    "version": "3",
    "properties": {
      "supported": [{
        "name": "connectivity"
      }],
      "proactivelyReported": false,
      "retrievable": true
    }
  };
};
module.exports = new AlexaCapabilities();
