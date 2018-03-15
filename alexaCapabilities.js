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

AlexaCapabilities.prototype.powerController = function () {
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
  };
};


AlexaCapabilities.prototype.brightnessController = function () {
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
    catagory: "LIGHT"
  };
};

AlexaCapabilities.prototype.powerLevelController = function () {
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
    catagory: "OTHER"
  };
};

AlexaCapabilities.prototype.percentageController = function () {
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
    catagory: "OTHER"
  };
};

AlexaCapabilities.prototype.thermostatController = function (targetSetpoint, upperSetpoint, lowerSetpoint, thermostatMode) {
  var supported = [];
  if (targetSetpoint) {
    supported.push({
      "name": "targetSetpoint"
    })
  }
  if (upperSetpoint) {
    supported.push({
      "name": "upperSetpoint"
    })
  }
  if (lowerSetpoint) {
    supported.push({
      "name": "lowerSetpoint"
    })
  }
  if (thermostatMode) {
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
    catagory: "THERMOSTAT"
  };
};


AlexaCapabilities.prototype.temperatureSensor = function () {
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
  };
};

AlexaCapabilities.prototype.lockController = function () {
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
    catagory: "SMARTLOCK"
  };
};

AlexaCapabilities.prototype.colorController = function () {
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
    catagory: "LIGHT"
  };
};

AlexaCapabilities.prototype.colorTemperatureController = function () {
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
    catagory: "LIGHT"
  };
};

AlexaCapabilities.prototype.sceneController = function () {
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.SceneController",
      "version": "3",
      "supportsDeactivation": false,
      "proactivelyReported": false
    },
    catagory: "SCENE_TRIGGER"
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
AlexaCapabilities.prototype.cameraStreamController = function (cameraStreamConfigurations) {
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
    catagory: "CAMERA"
  };
};

/**
 * Not implemented yet!
 * @param {*} name 
 */
AlexaCapabilities.prototype.channelController = function () {
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
    catagory: "TV"
  }
}

AlexaCapabilities.prototype.inputController = function () {
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
    catagory: "ACTIVITY_TRIGGER"
  }
}

AlexaCapabilities.prototype.speaker = function (volumeName, mutedName) {
  var supported = [];
  if (volumeName) {
    supported.push({
      "name": "volume"
    })
  }
  if (mutedName) {
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
    catagory: "SPEAKER"
  };
};

AlexaCapabilities.prototype.stepSpeaker = function (volumeName, mutedName) {
  var supported = [];
  if (volumeName) {
    supported.push({
      "name": "volume"
    })
  }
  if (mutedName) {
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
    catagory: "SPEAKER"
  };
};

AlexaCapabilities.prototype.playbackController = function () {
  return {
    capabilities: {
      "type": "AlexaInterface",
      "interface": "Alexa.PlaybackController",
      "version": "3",
      "proactivelyReported": false,
      "supportedOperations": ["Play", "Pause", "Next", "Previous", "Rewind", "FastForward", "Stop"]
    },
    catagory: "OTHER"
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
