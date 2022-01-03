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

const { Capability } = require('../constants');

/**
 * Defines supported capability classes
 * @type {Object}
 */
module.exports = {
  [Capability.ALEXA]: require('./alexa'),
  [Capability.BRIGHTNESS_CONTROLLER]: require('./brightnessController'),
  [Capability.CAMERA_STREAM_CONTROLLER]: require('./cameraStreamController'),
  [Capability.CHANNEL_CONTROLLER]: require('./channelController'),
  [Capability.COLOR_CONTROLLER]: require('./colorController'),
  [Capability.COLOR_TEMPERATURE_CONTROLLER]: require('./colorTemperatureController'),
  [Capability.CONTACT_SENSOR]: require('./contactSensor'),
  [Capability.ENDPOINT_HEALTH]: require('./endpointHealth'),
  [Capability.EQUALIZER_CONTROLLER]: require('./equalizerController'),
  [Capability.INPUT_CONTROLLER]: require('./inputController'),
  [Capability.LOCK_CONTROLLER]: require('./lockController'),
  [Capability.MODE_CONTROLLER]: require('./modeController'),
  [Capability.MOTION_SENSOR]: require('./motionSensor'),
  [Capability.NETWORKING_ACCESS_CONTROLLER]: require('./networkingAccessController'),
  [Capability.NETWORKING_CONNECTED_DEVICE]: require('./networkingConnectedDevice'),
  [Capability.NETWORKING_HOME_NETWORK_CONTROLLER]: require('./networkingHomeNetworkController'),
  [Capability.PERCENTAGE_CONTROLLER]: require('./percentageController'),
  [Capability.PLAYBACK_CONTROLLER]: require('./playbackController'),
  [Capability.POWER_CONTROLLER]: require('./powerController'),
  [Capability.POWER_LEVEL_CONTROLLER]: require('./powerLevelController'),
  [Capability.RANGE_CONTROLLER]: require('./rangeController'),
  [Capability.SAFETY]: require('./safety'),
  [Capability.SCENE_CONTROLLER]: require('./sceneController'),
  [Capability.SECURITY_PANEL_CONTROLLER]: require('./securityPanelController'),
  [Capability.SPEAKER]: require('./speaker'),
  [Capability.STEP_SPEAKER]: require('./stepSpeaker'),
  [Capability.TEMPERATURE_SENSOR]: require('./temperatureSensor'),
  [Capability.THERMOSTAT_CONTROLLER]: require('./thermostatController'),
  [Capability.TOGGLE_CONTROLLER]: require('./toggleController')
};

/**
 * Returns new capability object for a given name and instance
 * @param  {String} name
 * @param  {String} instance
 * @return {Object}
 */
module.exports.build = function (name, instance) {
  if (typeof this[name] === 'function') {
    return new this[name](name, instance);
  }
};
