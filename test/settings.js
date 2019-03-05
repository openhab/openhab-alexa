var settings = {
  "testCasesV3": {
    "discovery": {
      "Fan": [
        "./v3/test_discoverFan.js",
      ],
      "Light": [
        "./v3/test_discoverLightColor.js",
        "./v3/test_discoverLightColorTemperature.js",
        "./v3/test_discoverLightGroup.js"
      ],
      "Lock": [
        "./v3/test_discoverLock.js"
      ],
      "Scene": [
        "./v3/test_discoverScene.js"
      ],
      "Sensor": [
        "./v3/test_discoverSensor.js"
      ],
      "Speaker": [
        "./v3/test_discoverSpeaker.js",
        "./v3/test_discoverStepSpeaker.js"
      ],
      "Switch": [
        "./v3/test_discoverSwitchRollershutter.js"
      ],
      "Thermostat": [
        "./v3/test_discoverThermostat.js"
      ],
      "TV": [
        "./v3/test_discoverTelevision.js"
      ],
      "Washer": [
        "./v3/test_discoverWasher.js"
      ],
    },
    "controllers": {
      "Alexa": [
        "./v3/test_controllerAlexa.js"
      ],
      "Authorization": [
        "./v3/test_controllerAuthorization.js"
      ],
      "BrightnessController": [
        "./v3/test_controllerBrightness.js"
      ],
      "ChannelController": [
        "./v3/test_controllerChannel.js"
      ],
      "ColorController": [
        "./v3/test_controllerColor.js"
      ],
      "ColorTemperatureController": [
        "./v3/test_controllerColorTemperature.js"
      ],
      "ContactSensor": [
        "./v3/test_controllerContactSensor.js"
      ],
      "InputController": [
        "./v3/test_controllerInput.js"
      ],
      "LockController": [
        "./v3/test_controllerLock.js"
      ],
      "ModeController": [
        "./v3/test_controllerMode.js"
      ],
      "MotionSensor": [
        "./v3/test_controllerMotionSensor.js"
      ],
      "PercentageController": [
        "./v3/test_controllerPercentage.js"
      ],
      "PlaybackController": [
        "./v3/test_controllerPlayback.js"
      ],
      "PowerController": [
        "./v3/test_controllerPower.js"
      ],
      "PowerLevelController": [
        "./v3/test_controllerPowerLevel.js"
      ],
      "RangeController": [
        "./v3/test_controllerRange.js"
      ],
      "SceneController": [
        "./v3/test_controllerScene.js"
      ],
      "Speaker": [
        "./v3/test_controllerSpeaker.js"
      ],
      "StepSpeaker": [
        "./v3/test_controllerStepSpeaker.js"
      ],
      "ThermostatController": [
        "./v3/test_controllerThermostatMode.js",
        "./v3/test_controllerThermostatTemperature.js"
      ],
      "ToggleController": [
        "./v3/test_controllerToggle.js"
      ],
    }
  }
};

module.exports = settings;
