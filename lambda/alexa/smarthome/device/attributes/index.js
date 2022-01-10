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
 * Defines supported device attribute classes
 * @type {Object}
 */
module.exports = {
  AlarmAlert: require('./alarmAlert'),
  ArmState: require('./armState'),
  BatteryLevel: require('./batteryLevel'),
  Brightness: require('./brightness'),
  BurglaryAlarm: require('./burglaryAlarm'),
  CameraStream: require('./cameraStream'),
  CarbonMonoxideAlarm: require('./carbonMonoxideAlarm'),
  Channel: require('./channel'),
  ChannelStep: require('./channelStep'),
  Color: require('./color'),
  ColorTemperature: require('./colorTemperature'),
  ContactDetectionState: require('./contactDetectionState'),
  CoolingSetpoint: require('./coolingSetpoint'),
  CurrentLockState: require('./currentLockState'),
  CurrentOpenState: require('./currentOpenState'),
  EcoCoolingSetpoint: require('./ecoCoolingSetpoint'),
  EcoHeatingSetpoint: require('./ecoHeatingSetpoint'),
  EqualizerBass: require('./equalizerBass'),
  EqualizerMidrange: require('./equalizerMidrange'),
  EqualizerMode: require('./equalizerMode'),
  EqualizerTreble: require('./equalizerTreble'),
  FanDirection: require('./fanDirection'),
  FanOscillate: require('./fanOscillate'),
  FanSpeed: require('./fanSpeed'),
  FireAlarm: require('./fireAlarm'),
  HeatingCoolingMode: require('./heatingCoolingMode'),
  HeatingSetpoint: require('./heatingSetpoint'),
  Humidity: require('./humidity'),
  Input: require('./input'),
  LockState: require('./lockState'),
  Mode: require('./mode'),
  MotionDetectionState: require('./motionDetectionState'),
  MuteState: require('./muteState'),
  MuteStep: require('./muteStep'),
  NetworkAccess: require('./networkAccess'),
  ObstacleAlert: require('./obstacleAlert'),
  OpenState: require('./openState'),
  Percentage: require('./percentage'),
  Playback: require('./playback'),
  PlaybackStop: require('./playbackStop'),
  PositionState: require('./positionState'),
  PowerLevel: require('./powerLevel'),
  PowerState: require('./powerState'),
  RangeValue: require('./rangeValue'),
  ReadyAlert: require('./readyAlert'),
  Scene: require('./scene'),
  TargetTemperature: require('./targetTemperature'),
  Temperature: require('./temperature'),
  ThermostatFan: require('./thermostatFan'),
  ThermostatHold: require('./thermostatHold'),
  TiltAngle: require('./tiltAngle'),
  ToggleState: require('./toggleState'),
  TroubleAlert: require('./troubleAlert'),
  VacuumMode: require('./vacuumMode'),
  VolumeLevel: require('./volumeLevel'),
  VolumeStep: require('./volumeStep'),
  WaterAlarm: require('./waterAlarm'),
  ZonesAlert: require('./zonesAlert')
};

/**
 * Returns device generic attributes
 * @type {Array}
 */
module.exports.genericAttributes = [require('./mode'), require('./rangeValue'), require('./toggleState')];

/**
 * Returns device attribute based on given name
 * @param  {String} name
 * @return {Object}
 */
module.exports.get = function (name) {
  return Object.values(this).find(
    (deviceAttribute) => deviceAttribute.supportedNames && deviceAttribute.supportedNames.includes(name)
  );
};
