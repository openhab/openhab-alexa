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

/**
 * Defines supported property classes
 * @type {Object}
 */
module.exports = {
  AlarmState: require('./alarmState'),
  AlertState: require('./alertState'),
  ArmState: require('./armState'),
  BinaryState: require('./binaryState'),
  Brightness: require('./brightness'),
  CameraStream: require('./cameraStream'),
  Channel: require('./channel'),
  ChannelStep: require('./channelStep'),
  Color: require('./color'),
  ColorTemperature: require('./colorTemperature'),
  ConnectedDevice: require('./connectedDevice'),
  Connectivity: require('./connectivity'),
  DecoupleState: require('./decoupleState'),
  DetectionState: require('./detectionState'),
  EqualizerBands: require('./equalizerBands'),
  EqualizerMode: require('./equalizerMode'),
  Generic: require('./generic'),
  Input: require('./input'),
  LockState: require('./lockState'),
  LowerSetpoint: require('./lowerSetpoint'),
  Mode: require('./mode'),
  MuteState: require('./muteState'),
  MuteStep: require('./muteStep'),
  NetworkAccess: require('./networkAccess'),
  Percentage: require('./percentage'),
  Playback: require('./playback'),
  PlaybackAction: require('./playbackAction'),
  PlaybackStop: require('./playbackStop'),
  PowerLevel: require('./powerLevel'),
  PowerState: require('./powerState'),
  RangeValue: require('./rangeValue'),
  Scene: require('./scene'),
  SecurityAlert: require('./securityAlert'),
  TargetSetpoint: require('./targetSetpoint'),
  Temperature: require('./temperature'),
  ThermostatHold: require('./thermostatHold'),
  ThermostatMode: require('./thermostatMode'),
  ToggleState: require('./toggleState'),
  UpperSetpoint: require('./upperSetpoint'),
  VolumeLevel: require('./volumeLevel'),
  VolumeStep: require('./volumeStep')
};
