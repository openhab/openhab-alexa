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
 * Defines alexa capability enum
 * @type {Object}
 */
export const Capability = Object.freeze({
  ALEXA: 'Alexa',
  BRIGHTNESS_CONTROLLER: 'BrightnessController',
  CAMERA_STREAM_CONTROLLER: 'CameraStreamController',
  CHANNEL_CONTROLLER: 'ChannelController',
  COLOR_CONTROLLER: 'ColorController',
  COLOR_TEMPERATURE_CONTROLLER: 'ColorTemperatureController',
  CONTACT_SENSOR: 'ContactSensor',
  ENDPOINT_HEALTH: 'EndpointHealth',
  EQUALIZER_CONTROLLER: 'EqualizerController',
  INPUT_CONTROLLER: 'InputController',
  LOCK_CONTROLLER: 'LockController',
  MODE_CONTROLLER: 'ModeController',
  MOTION_SENSOR: 'MotionSensor',
  NETWORKING_ACCESS_CONTROLLER: 'NetworkingAccessController',
  NETWORKING_CONNECTED_DEVICE: 'NetworkingConnectedDevice',
  NETWORKING_HOME_NETWORK_CONTROLLER: 'NetworkingHomeNetworkController',
  PERCENTAGE_CONTROLLER: 'PercentageController',
  PLAYBACK_CONTROLLER: 'PlaybackController',
  PLAYBACK_STATE_REPORTER: 'PlaybackStateReporter',
  POWER_CONTROLLER: 'PowerController',
  POWER_LEVEL_CONTROLLER: 'PowerLevelController',
  RANGE_CONTROLLER: 'RangeController',
  SAFETY: 'Safety',
  SCENE_CONTROLLER: 'SceneController',
  SECURITY_PANEL_CONTROLLER: 'SecurityPanelController',
  SPEAKER: 'Speaker',
  STEP_SPEAKER: 'StepSpeaker',
  TEMPERATURE_SENSOR: 'TemperatureSensor',
  THERMOSTAT_CONTROLLER: 'ThermostatController',
  TOGGLE_CONTROLLER: 'ToggleController'
});

/**
 * Defines alexa interface enum
 * @type {Object}
 */
export const Interface = Object.freeze({
  ALEXA: 'Alexa',
  ALEXA_AUTHORIZATION: 'Alexa.Authorization',
  ALEXA_BRIGHTNESS_CONTROLLER: 'Alexa.BrightnessController',
  ALEXA_CAMERA_STREAM_CONTROLLER: 'Alexa.CameraStreamController',
  ALEXA_CHANNEL_CONTROLLER: 'Alexa.ChannelController',
  ALEXA_COLOR_CONTROLLER: 'Alexa.ColorController',
  ALEXA_COLOR_TEMPERATURE_CONTROLLER: 'Alexa.ColorTemperatureController',
  ALEXA_CONTACT_SENSOR: 'Alexa.ContactSensor',
  ALEXA_DISCOVERY: 'Alexa.Discovery',
  ALEXA_ENDPOINT_HEALTH: 'Alexa.EndpointHealth',
  ALEXA_EQUALIZER_CONTROLLER: 'Alexa.EqualizerController',
  ALEXA_INPUT_CONTROLLER: 'Alexa.InputController',
  ALEXA_LOCK_CONTROLLER: 'Alexa.LockController',
  ALEXA_MODE_CONTROLLER: 'Alexa.ModeController',
  ALEXA_MOTION_SENSOR: 'Alexa.MotionSensor',
  ALEXA_NETWORKING_ACCESS_CONTROLLER: 'Alexa.Networking.AccessController',
  ALEXA_NETWORKING_CONNECTED_DEVICE: 'Alexa.Networking.ConnectedDevice',
  ALEXA_NETWORKING_HOME_NETWORK_CONTROLLER: 'Alexa.Networking.HomeNetworkController',
  ALEXA_PERCENTAGE_CONTROLLER: 'Alexa.PercentageController',
  ALEXA_PLAYBACK_CONTROLLER: 'Alexa.PlaybackController',
  ALEXA_PLAYBACK_STATE_REPORTER: 'Alexa.PlaybackStateReporter',
  ALEXA_POWER_CONTROLLER: 'Alexa.PowerController',
  ALEXA_POWER_LEVEL_CONTROLLER: 'Alexa.PowerLevelController',
  ALEXA_RANGE_CONTROLLER: 'Alexa.RangeController',
  ALEXA_SAFETY: 'Alexa.Safety',
  ALEXA_SCENE_CONTROLLER: 'Alexa.SceneController',
  ALEXA_SECURITY_PANEL_CONTROLLER: 'Alexa.SecurityPanelController',
  ALEXA_SPEAKER: 'Alexa.Speaker',
  ALEXA_STEP_SPEAKER: 'Alexa.StepSpeaker',
  ALEXA_TEMPERATURE_SENSOR: 'Alexa.TemperatureSensor',
  ALEXA_THERMOSTAT_CONTROLLER: 'Alexa.ThermostatController',
  ALEXA_TOGGLE_CONTROLLER: 'Alexa.ToggleController'
});

/**
 * Defines alexa property enum
 * @type {Object}
 */
export const Property = Object.freeze({
  ALARM_ALERT: 'alarmAlert',
  ARM_STATE: 'armState',
  BRIGHTNESS: 'brightness',
  BURGLARY_ALARM: 'burglaryAlarm',
  CAMERA_STREAM: 'cameraStream',
  CARBON_MONOXIDE_ALARM: 'carbonMonoxideAlarm',
  CHANNEL: 'channel',
  CHANNEL_STEP: 'channelStep',
  COLOR: 'color',
  COLOR_TEMPERATURE: 'colorTemperatureInKelvin',
  CONNECTED_DEVICE: 'connectedDevice',
  CONNECTIVITY: 'connectivity',
  DETECTION_STATE: 'detectionState',
  EQUALIZER_BANDS: 'bands',
  EQUALIZER_MODE: 'mode',
  FIRE_ALARM: 'fireAlarm',
  INPUT: 'input',
  LOCK_STATE: 'lockState',
  LOWER_SETPOINT: 'lowerSetpoint',
  MODE: 'mode',
  MUTED: 'muted',
  NETWORK_ACCESS: 'networkAccess',
  OBSTACLE_ALERT: 'obstacleAlert',
  PERCENTAGE: 'percentage',
  PLAYBACK: 'playback',
  PLAYBACK_ACTION: 'playbackAction',
  PLAYBACK_STATE: 'playbackState',
  PLAYBACK_STEP: 'playbackStep',
  PLAYBACK_STOP: 'playbackStop',
  POWER_LEVEL: 'powerLevel',
  POWER_STATE: 'powerState',
  RANGE_VALUE: 'rangeValue',
  READY_ALERT: 'readyAlert',
  SCENE: 'scene',
  TARGET_SETPOINT: 'targetSetpoint',
  TEMPERATURE: 'temperature',
  THERMOSTAT_HOLD: 'thermostatHold',
  THERMOSTAT_MODE: 'thermostatMode',
  TOGGLE_STATE: 'toggleState',
  TROUBLE_ALERT: 'troubleAlert',
  UPPER_SETPOINT: 'upperSetpoint',
  VOLUME: 'volume',
  WATER_ALARM: 'waterAlarm',
  ZONES_ALERT: 'zonesAlert'
});

/**
 * Defines alexa metadata parameter enum
 * @type {Object}
 */
export const Parameter = Object.freeze({
  ACTION_MAPPINGS: 'actionMappings',
  BINDING: 'binding',
  CAPABILITY_NAMES: 'capabilityNames',
  CHANNEL_MAPPINGS: 'channelMappings',
  COMFORT_RANGE: 'comfortRange',
  CONNECTED_TO: 'connectedTo',
  DEFAULT_LEVEL: 'defaultLevel',
  DEVICE_NAME: 'deviceName',
  EXIT_DELAY: 'exitDelay',
  HOSTNAME: 'hostname',
  INCREMENT: 'increment',
  INVERTED: 'inverted',
  LANGUAGE: 'language',
  MAC_ADDRESS: 'macAddress',
  NON_CONTROLLABLE: 'nonControllable',
  ORDERED: 'ordered',
  PASSWORD: 'password',
  PIN_CODES: 'pinCodes',
  PRESETS: 'presets',
  PRIMARY_CONTROL: 'primaryControl',
  PROXY_BASE_URL: 'proxyBaseUrl',
  RANGE: 'range',
  REQUIRES_SET_COLOR_RESET: 'requiresSetColorReset',
  REQUIRES_SETPOINT_HOLD: 'requiresSetpointHold',
  RESOLUTION: 'resolution',
  RETRIEVABLE: 'retrievable',
  SCALE: 'scale',
  SETPOINT_RANGE: 'setpointRange',
  SPEED_LEVELS: 'speedLevels',
  STATE_MAPPINGS: 'stateMappings',
  SUPPORTED_ARM_STATES: 'supportedArmStates',
  SUPPORTED_COMMANDS: 'supportedCommands',
  SUPPORTED_INPUTS: 'supportedInputs',
  SUPPORTED_MODES: 'supportedModes',
  SUPPORTED_OPERATIONS: 'supportedOperations',
  SUPPORTED_RANGE: 'supportedRange',
  SUPPORTS_CHANNEL_NUMBER: 'supportsChannelNumber',
  SUPPORTS_DEACTIVATION: 'supportsDeactivation',
  SUPPORTS_SETPOINT_MODE: 'supportsSetpointMode',
  UNIT_OF_MEASURE: 'unitOfMeasure',
  USERNAME: 'username'
});

/**
 * Defines alexa metadata parameter type enum
 * @type {Object}
 */
export const ParameterType = Object.freeze({
  BOOLEAN: 'boolean',
  FLOAT: 'float',
  INTEGER: 'integer',
  LIST: 'list',
  MAP: 'map',
  RANGE: 'range',
  STRING: 'string'
});
