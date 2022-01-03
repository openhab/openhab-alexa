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

module.exports = {
  Alexa: [require('./alexa.test.js')],
  Authorization: [require('./authorization.test.js')],
  BrightnessController: [require('./brightnessController.test.js')],
  CameraStreamController: [require('./cameraStreamController.test.js')],
  ChannelController: [require('./channelController.test.js')],
  ColorController: [require('./colorController.test.js')],
  ColorTemperatureController: [require('./colorTemperatureController.test.js')],
  Discovery: [
    require('./discovery/activity.test.js'),
    require('./discovery/airConditioner.test.js'),
    require('./discovery/airFreshener.test.js'),
    require('./discovery/airPurifier.test.js'),
    require('./discovery/automobile.test.js'),
    require('./discovery/automobileAccessory.test.js'),
    require('./discovery/blind.test.js'),
    require('./discovery/bluetoothSpeaker.test.js'),
    require('./discovery/camera.test.js'),
    require('./discovery/christmasTree.test.js'),
    require('./discovery/coffeeMaker.test.js'),
    require('./discovery/computer.test.js'),
    require('./discovery/contactSensor.test.js'),
    require('./discovery/dishwasher.test.js'),
    require('./discovery/door.test.js'),
    require('./discovery/doorbell.test.js'),
    require('./discovery/dryer.test.js'),
    require('./discovery/fan.test.js'),
    require('./discovery/gameConsole.test.js'),
    require('./discovery/headphones.test.js'),
    require('./discovery/hub.test.js'),
    require('./discovery/laptop.test.js'),
    require('./discovery/light.test.js'),
    require('./discovery/lock.test.js'),
    require('./discovery/microwave.test.js'),
    require('./discovery/mobilePhone.test.js'),
    require('./discovery/motionSensor.test.js'),
    require('./discovery/musicSystem.test.js'),
    require('./discovery/networkHardware.test.js'),
    require('./discovery/other.test.js'),
    require('./discovery/outlet.test.js'),
    require('./discovery/oven.test.js'),
    require('./discovery/phone.test.js'),
    require('./discovery/printer.test.js'),
    require('./discovery/router.test.js'),
    require('./discovery/scene.test.js'),
    require('./discovery/screen.test.js'),
    require('./discovery/securityPanel.test.js'),
    require('./discovery/securitySystem.test.js'),
    require('./discovery/shutter.test.js'),
    require('./discovery/slowCooker.test.js'),
    require('./discovery/speaker.test.js'),
    require('./discovery/stepSpeaker.test.js'),
    require('./discovery/streamingDevice.test.js'),
    require('./discovery/switch.test.js'),
    require('./discovery/tablet.test.js'),
    require('./discovery/television.test.js'),
    require('./discovery/temperatureSensor.test.js'),
    require('./discovery/thermostat.test.js'),
    require('./discovery/vacuumCleaner.test.js'),
    require('./discovery/washer.test.js'),
    require('./discovery/waterHeater.test.js'),
    require('./discovery/wearable.test.js')
  ],
  EqualizerController: [require('./equalizerController.test.js')],
  InputController: [require('./inputController.test.js')],
  LockController: [require('./lockController.test.js')],
  ModeController: [require('./modeController.test.js')],
  NetworkingAccessController: [require('./networkingAccessController.test.js')],
  PercentageController: [require('./percentageController.test.js')],
  PlaybackController: [require('./playbackController.test.js')],
  PowerController: [require('./powerController.test.js')],
  PowerLevelController: [require('./powerLevelController.test.js')],
  RangeController: [require('./rangeController.test.js')],
  SceneController: [require('./sceneController.test.js')],
  SecurityPanelController: [require('./securityPanelController.test.js')],
  Speaker: [require('./speaker.test.js')],
  StepSpeaker: [require('./stepSpeaker.test.js')],
  ThermostatController: [
    require('./thermostatControllerMode.test.js'),
    require('./thermostatControllerTemperature.test.js')
  ],
  ToggleController: [require('./toggleController.test.js')]
};
