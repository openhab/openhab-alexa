/**
 * Copyright (c) 2010-2022 Contributors to the openHAB project
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

import alexTest from './alexa.test.js';
import authorizationTest from './authorization.test.js';
import brightnessControllerTest from './brightnessController.test.js';
import cameraStreamControllerTest from './cameraStreamController.test.js';
import channelControllerTest from './channelController.test.js';
import colorControllerTest from './colorController.test.js';
import colorTemperatureControllerTest from './colorTemperatureController.test.js';
import discoveryActivityTest from './discovery/activity.test.js';
import discoveryAirConditionerTest from './discovery/airConditioner.test.js';
import discoveryAirFreshenerTest from './discovery/airFreshener.test.js';
import discoveryAirPurifierTest from './discovery/airPurifier.test.js';
import discoveryAutomobileTest from './discovery/automobile.test.js';
import discoveryAutomobileAccessoryTest from './discovery/automobileAccessory.test.js';
import discoveryBlindTest from './discovery/blind.test.js';
import discoveryBluetoothSpeakerTest from './discovery/bluetoothSpeaker.test.js';
import discoveryCameraTest from './discovery/camera.test.js';
import discoveryChristmasTreeTest from './discovery/christmasTree.test.js';
import discoveryCoffeeMakerTest from './discovery/coffeeMaker.test.js';
import discoveryComputerTest from './discovery/computer.test.js';
import discoveryContactSensorTest from './discovery/contactSensor.test.js';
import discoveryDishwasherTest from './discovery/dishwasher.test.js';
import discoveryDoorTest from './discovery/door.test.js';
import discoveryDoorbellTest from './discovery/doorbell.test.js';
import discoveryDryerTest from './discovery/dryer.test.js';
import discoveryFanTest from './discovery/fan.test.js';
import discoveryGameConsoleTest from './discovery/gameConsole.test.js';
import discoveryHeadphonesTest from './discovery/headphones.test.js';
import discoveryHubTest from './discovery/hub.test.js';
import discoveryLaptopTest from './discovery/laptop.test.js';
import discoveryLightTest from './discovery/light.test.js';
import discoveryLockTest from './discovery/lock.test.js';
import discoveryMicrowaveTest from './discovery/microwave.test.js';
import discoveryMobilePhoneTest from './discovery/mobilePhone.test.js';
import discoveryMotionSensorTest from './discovery/motionSensor.test.js';
import discoveryMusicSystemTest from './discovery/musicSystem.test.js';
import discoveryNetworkHardwareTest from './discovery/networkHardware.test.js';
import discoveryOtherTest from './discovery/other.test.js';
import discoveryOutletTest from './discovery/outlet.test.js';
import discoveryOvenTest from './discovery/oven.test.js';
import discoveryPhoneTest from './discovery/phone.test.js';
import discoveryPrinterTest from './discovery/printer.test.js';
import discoveryRouterTest from './discovery/router.test.js';
import discoverySceneTest from './discovery/scene.test.js';
import discoveryScreenTest from './discovery/screen.test.js';
import discoverySecurityPanelTest from './discovery/securityPanel.test.js';
import discoverySecuritySystemTest from './discovery/securitySystem.test.js';
import discoveryShutterTest from './discovery/shutter.test.js';
import discoverySlowCookerTest from './discovery/slowCooker.test.js';
import discoverySpeakerTest from './discovery/speaker.test.js';
import discoveryStepSpeakerTest from './discovery/stepSpeaker.test.js';
import discoveryStreamingDeviceTest from './discovery/streamingDevice.test.js';
import discoverySwitchTest from './discovery/switch.test.js';
import discoveryTabletTest from './discovery/tablet.test.js';
import discoveryTelevisionTest from './discovery/television.test.js';
import discoveryTemperatureSensorTest from './discovery/temperatureSensor.test.js';
import discoveryThermostatTest from './discovery/thermostat.test.js';
import discoveryVacuumCleanerTest from './discovery/vacuumCleaner.test.js';
import discoveryWasherTest from './discovery/washer.test.js';
import discoveryWaterHeaterTest from './discovery/waterHeater.test.js';
import discoveryWearableTest from './discovery/wearable.test.js';
import equalizerControllerTest from './equalizerController.test.js';
import inputControllerTest from './inputController.test.js';
import lockControllerTest from './lockController.test.js';
import modeControllerTest from './modeController.test.js';
import networkingAccessControllerTest from './networkingAccessController.test.js';
import percentageControllerTest from './percentageController.test.js';
import playbackControllerTest from './playbackController.test.js';
import powerControllerTest from './powerController.test.js';
import powerLevelControllerTest from './powerLevelController.test.js';
import rangeControllerTest from './rangeController.test.js';
import sceneControllerTest from './sceneController.test.js';
import securityPanelControllerTest from './securityPanelController.test.js';
import speakerTest from './speaker.test.js';
import stepSpeakerTest from './stepSpeaker.test.js';
import thermostatControllerModeTest from './thermostatControllerMode.test.js';
import thermostatControllerTemperatureTest from './thermostatControllerTemperature.test.js';
import toggleControllerTest from './toggleController.test.js';

export default {
  Alexa: [alexTest],
  Authorization: [authorizationTest],
  BrightnessController: [brightnessControllerTest],
  CameraStreamController: [cameraStreamControllerTest],
  ChannelController: [channelControllerTest],
  ColorController: [colorControllerTest],
  ColorTemperatureController: [colorTemperatureControllerTest],
  Discovery: [
    discoveryActivityTest,
    discoveryAirConditionerTest,
    discoveryAirFreshenerTest,
    discoveryAirPurifierTest,
    discoveryAutomobileTest,
    discoveryAutomobileAccessoryTest,
    discoveryBlindTest,
    discoveryBluetoothSpeakerTest,
    discoveryCameraTest,
    discoveryChristmasTreeTest,
    discoveryCoffeeMakerTest,
    discoveryComputerTest,
    discoveryContactSensorTest,
    discoveryDishwasherTest,
    discoveryDoorTest,
    discoveryDoorbellTest,
    discoveryDryerTest,
    discoveryFanTest,
    discoveryGameConsoleTest,
    discoveryHeadphonesTest,
    discoveryHubTest,
    discoveryLaptopTest,
    discoveryLightTest,
    discoveryLockTest,
    discoveryMicrowaveTest,
    discoveryMobilePhoneTest,
    discoveryMotionSensorTest,
    discoveryMusicSystemTest,
    discoveryNetworkHardwareTest,
    discoveryOtherTest,
    discoveryOutletTest,
    discoveryOvenTest,
    discoveryPhoneTest,
    discoveryPrinterTest,
    discoveryRouterTest,
    discoverySceneTest,
    discoveryScreenTest,
    discoverySecurityPanelTest,
    discoverySecuritySystemTest,
    discoveryShutterTest,
    discoverySlowCookerTest,
    discoverySpeakerTest,
    discoveryStepSpeakerTest,
    discoveryStreamingDeviceTest,
    discoverySwitchTest,
    discoveryTabletTest,
    discoveryTelevisionTest,
    discoveryTemperatureSensorTest,
    discoveryThermostatTest,
    discoveryVacuumCleanerTest,
    discoveryWasherTest,
    discoveryWaterHeaterTest,
    discoveryWearableTest
  ],
  EqualizerController: [equalizerControllerTest],
  InputController: [inputControllerTest],
  LockController: [lockControllerTest],
  ModeController: [modeControllerTest],
  NetworkingAccessController: [networkingAccessControllerTest],
  PercentageController: [percentageControllerTest],
  PlaybackController: [playbackControllerTest],
  PowerController: [powerControllerTest],
  PowerLevelController: [powerLevelControllerTest],
  RangeController: [rangeControllerTest],
  SceneController: [sceneControllerTest],
  SecurityPanelController: [securityPanelControllerTest],
  Speaker: [speakerTest],
  StepSpeaker: [stepSpeakerTest],
  ThermostatController: [thermostatControllerModeTest, thermostatControllerTemperatureTest],
  ToggleController: [toggleControllerTest]
};
