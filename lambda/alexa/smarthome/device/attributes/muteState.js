/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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

const { Capability, Property } = require('@alexa/smarthome/constants');
const { Parameter, ParameterType } = require('@alexa/smarthome/metadata');
const DeviceAttribute = require('./attribute');

/**
 * Defines mute state attribute class
 * @extends DeviceAttribute
 */
class MuteState extends DeviceAttribute {
  /**
   * Returns supported names
   * @return {Array}
   */
  static get supportedNames() {
    return [
      'MuteState',
      'SpeakerMute' // For backward compatibility (deprecated)
    ];
  }

  /**
   * Returns capabilities
   * @param  {Object} item
   * @param  {Object} metadata
   * @return {Array}
   */
  static getCapabilities(item, metadata) {
    const isStepSpeaker = metadata.getConfigParameter(Parameter.STEP_SPEAKER, ParameterType.BOOLEAN);

    return [
      {
        name: isStepSpeaker ? Capability.STEP_SPEAKER : Capability.SPEAKER,
        property: Property.MUTED
      }
    ];
  }
}

module.exports = MuteState;
