var settings = {
  "testCases": {
    "discovery": {
      "Light": [
        "./test_discoverLightColor.js",
        "./test_discoverLightColorTemperature.js",
        "./test_discoverLightGroup.js"
      ],
      "Lock": [
        "./test_discoverLock.js"
      ],
      "Scene": [
        "./test_discoverScene.js"
      ],
      "Speaker": [
        "./test_discoverSpeaker.js",
        "./test_discoverStepSpeaker.js"
      ],
      "Switch": [
        "./test_discoverSwitchRollershutter.js"
      ],
      "Thermostat": [
        "./test_discoverThermostat.js"
      ],
      "TV": [
        "./test_discoverTelevision.js"
      ],
    },
    "controllers": {
      "Alexa": [
        "./test_controllerAlexa.js"
      ],
      "BrightnessController": [
        "./test_controllerBrightness.js"
      ],
      "ChannelController": [
        "./test_controllerChannel.js"
      ],
      "ColorController": [
        "./test_controllerColor.js"
      ],
      "ColorTemperatureController": [
        "./test_controllerColorTemperature.js"
      ],
      "InputController": [
        "./test_controllerInput.js"
      ],
      "LockController": [
        "./test_controllerLock.js"
      ],
      "PercentageController": [
        "./test_controllerPercentage.js"
      ],
      "PlaybackController": [
        "./test_controllerPlayback.js"
      ],
      "PowerController": [
        "./test_controllerPower.js"
      ],
      "PowerLevelController": [
        "./test_controllerPowerLevel.js"
      ],
      "SceneController": [
        "./test_controllerScene.js"
      ],
      "Speaker": [
        "./test_controllerSpeaker.js"
      ],
      "StepSpeaker": [
        "./test_controllerStepSpeaker.js"
      ],
      "ThermostatController": [
        "./test_controllerThermostatMode.js",
        "./test_controllerThermostatTemperature.js"
      ],
    }
  }
};

module.exports = settings;
