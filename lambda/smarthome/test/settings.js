/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */

module.exports = {
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
      "SecurityPanel": [
        "./v3/test_discoverSecurityPanel.js"
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
      "EqualizerController": [
        "./v3/test_controllerEqualizer.js"
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
      "PlaybackStateReporter": [
        "./v3/test_controllerPlaybackStateReporter.js"
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
      "SecurityPanelController": [
        "./v3/test_controllerSecurityPanel.js"
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
