/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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
 * Exports supported interface v3 directive classes
 * @type {Object}
 */
module.exports = {
  Alexa:                              require('./alexa.js'),
  AlexaAuthorization:                 require('./authorization.js'),
  AlexaBrightnessController:          require('./brightnessController.js'),
  AlexaCameraStreamController:        require('./cameraStreamController.js'),
  AlexaChannelController:             require('./channelController.js'),
  AlexaColorController:               require('./colorController.js'),
  AlexaColorTemperatureController:    require('./colorTemperatureController.js'),
  AlexaDiscovery:                     require('./discovery.js'),
  AlexaEqualizerController:           require('./equalizerController.js'),
  AlexaInputController:               require('./inputController.js'),
  AlexaLockController:                require('./lockController.js'),
  AlexaModeController:                require('./modeController.js'),
  AlexaPercentageController:          require('./percentageController.js'),
  AlexaPlaybackController:            require('./playbackController.js'),
  AlexaPowerController:               require('./powerController.js'),
  AlexaPowerLevelController:          require('./powerLevelController.js'),
  AlexaRangeController:               require('./rangeController.js'),
  AlexaSceneController:               require('./sceneController.js'),
  AlexaSecurityPanelController:       require('./securityPanelController.js'),
  AlexaSpeaker:                       require('./speaker.js'),
  AlexaStepSpeaker:                   require('./stepSpeaker.js'),
  AlexaThermostatController:          require('./thermostatController.js'),
  AlexaToggleController:              require('./toggleController.js'),
  AlexaUnsupported:                   require('./unsupported.js'),
};
