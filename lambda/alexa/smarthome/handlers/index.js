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
 * Defines supported handler classes
 * @type {Object}
 */
module.exports = {
  Alexa: require('./alexa'),
  Authorization: require('./authorization'),
  BrightnessController: require('./brightnessController'),
  CameraStreamController: require('./cameraStreamController'),
  ChannelController: require('./channelController'),
  ColorController: require('./colorController'),
  ColorTemperatureController: require('./colorTemperatureController'),
  Discovery: require('./discovery'),
  EqualizerController: require('./equalizerController'),
  InputController: require('./inputController'),
  LockController: require('./lockController'),
  ModeController: require('./modeController'),
  NetworkingAccessController: require('./networkingAccessController'),
  PercentageController: require('./percentageController'),
  PlaybackController: require('./playbackController'),
  PowerController: require('./powerController'),
  PowerLevelController: require('./powerLevelController'),
  RangeController: require('./rangeController'),
  Safety: require('./safety'),
  SceneController: require('./sceneController'),
  SecurityPanelController: require('./securityPanelController'),
  Speaker: require('./speaker'),
  StepSpeaker: require('./stepSpeaker'),
  ThermostatController: require('./thermostatController'),
  ToggleController: require('./toggleController')
};

/**
 * Returns handler function for a given directive namespace and name
 * @param  {String} namespace
 * @param  {String} name
 * @return {AsyncFunction}
 */
module.exports.get = function (namespace, name) {
  for (const handler of Object.values(this)) {
    if (handler.namespace === namespace) {
      return handler.directives[name];
    }
  }
};
