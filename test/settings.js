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
      "Switch": [
        "./test_discoverSwitchRollershutter.js"
      ],
    },
    "controllers": {
      "Alexa": [
        "./test_controllerAlexa.js"
      ],
      "BrightnessController": [
        "./test_controllerBrightness.js"
      ],
      "ColorController": [
        "./test_controllerColor.js"
      ],
      "ColorTemperatureController": [
        "./test_controllerColorTemperature.js"
      ],
      "LockController": [
        "./test_controllerLock.js"
      ],
      "PercentageController": [
        "./test_controllerPercentage.js"
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
    }
  }
};

module.exports = settings;
