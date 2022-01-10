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

const GenericDevice = require('./genericDevice');
const {
  VolumeLevel,
  VolumeStep,
  MuteState,
  MuteStep,
  Channel,
  ChannelStep,
  Input,
  Playback,
  PlaybackStop,
  EqualizerBass,
  EqualizerMidrange,
  EqualizerTreble,
  EqualizerMode
} = require('../attributes');

/**
 * Defines entertainment device type class
 * @extends GenericDevice
 */
class Entertainment extends GenericDevice {
  /**
   * Returns supported attributes
   * @return {Array}
   */
  static get supportedAttributes() {
    return [
      VolumeLevel,
      VolumeStep,
      MuteState,
      MuteStep,
      Channel,
      ChannelStep,
      Input,
      Playback,
      PlaybackStop,
      EqualizerBass,
      EqualizerMidrange,
      EqualizerTreble,
      EqualizerMode,
      ...super.supportedAttributes
    ];
  }
}

module.exports = Entertainment;
