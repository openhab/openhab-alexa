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

import Mode from './mode.js';
import RangeValue from './rangeValue.js';
import ToggleState from './toggleState.js';

/**
 * Defines device generic attributes
 * @type {Array}
 */
export const genericAttributes = [Mode, RangeValue, ToggleState];

/**
 * Exports supported device attribute classes
 */
export { default as AlarmAlert } from './alarmAlert.js';
export { default as ArmState } from './armState.js';
export { default as BatteryLevel } from './batteryLevel.js';
export { default as Brightness } from './brightness.js';
export { default as BurglaryAlarm } from './burglaryAlarm.js';
export { default as CameraStream } from './cameraStream.js';
export { default as CarbonMonoxideAlarm } from './carbonMonoxideAlarm.js';
export { default as Channel } from './channel.js';
export { default as ChannelStep } from './channelStep.js';
export { default as Color } from './color.js';
export { default as ColorTemperature } from './colorTemperature.js';
export { default as ContactDetectionState } from './contactDetectionState.js';
export { default as CoolingSetpoint } from './coolingSetpoint.js';
export { default as CurrentLockState } from './currentLockState.js';
export { default as CurrentOpenState } from './currentOpenState.js';
export { default as EcoCoolingSetpoint } from './ecoCoolingSetpoint.js';
export { default as EcoHeatingSetpoint } from './ecoHeatingSetpoint.js';
export { default as EqualizerBass } from './equalizerBass.js';
export { default as EqualizerMidrange } from './equalizerMidrange.js';
export { default as EqualizerMode } from './equalizerMode.js';
export { default as EqualizerTreble } from './equalizerTreble.js';
export { default as FanDirection } from './fanDirection.js';
export { default as FanOscillate } from './fanOscillate.js';
export { default as FanSpeed } from './fanSpeed.js';
export { default as FireAlarm } from './fireAlarm.js';
export { default as HeatingCoolingMode } from './heatingCoolingMode.js';
export { default as HeatingSetpoint } from './heatingSetpoint.js';
export { default as Humidity } from './humidity.js';
export { default as Input } from './input.js';
export { default as LockState } from './lockState.js';
export { default as Mode } from './mode.js';
export { default as MotionDetectionState } from './motionDetectionState.js';
export { default as MuteState } from './muteState.js';
export { default as MuteStep } from './muteStep.js';
export { default as NetworkAccess } from './networkAccess.js';
export { default as ObstacleAlert } from './obstacleAlert.js';
export { default as OpenState } from './openState.js';
export { default as Percentage } from './percentage.js';
export { default as Playback } from './playback.js';
export { default as PlaybackStep } from './playbackStep.js';
export { default as PlaybackStop } from './playbackStop.js';
export { default as PositionState } from './positionState.js';
export { default as PowerLevel } from './powerLevel.js';
export { default as PowerState } from './powerState.js';
export { default as RangeValue } from './rangeValue.js';
export { default as ReadyAlert } from './readyAlert.js';
export { default as Scene } from './scene.js';
export { default as TargetTemperature } from './targetTemperature.js';
export { default as Temperature } from './temperature.js';
export { default as ThermostatFan } from './thermostatFan.js';
export { default as ThermostatHold } from './thermostatHold.js';
export { default as TiltAngle } from './tiltAngle.js';
export { default as ToggleState } from './toggleState.js';
export { default as TroubleAlert } from './troubleAlert.js';
export { default as VacuumMode } from './vacuumMode.js';
export { default as VolumeLevel } from './volumeLevel.js';
export { default as VolumeStep } from './volumeStep.js';
export { default as WaterAlarm } from './waterAlarm.js';
export { default as ZonesAlert } from './zonesAlert.js';
