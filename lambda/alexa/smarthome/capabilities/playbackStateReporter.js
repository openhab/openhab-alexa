/**
 * Copyright (c) 2010-2024 Contributors to the openHAB project
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

import AlexaCapability from './capability.js';
import { Capability, Interface, Property } from '../constants.js';
import { PlaybackState } from '../properties/index.js';

/**
 * Defines Alexa.PlaybackStateReporter interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-playbackcontroller.html#properties
 * @extends AlexaCapability
 */
export default class PlaybackStateReporter extends AlexaCapability {
  /**
   * Returns name
   * @return {String}
   */
  static get name() {
    return Capability.PLAYBACK_STATE_REPORTER;
  }

  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_PLAYBACK_STATE_REPORTER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.PLAYBACK_STATE]: PlaybackState
    };
  }

  /**
   * Returns required linked capabilities
   * @return {Array}
   */
  get requiredLinkedCapabilities() {
    return [{ name: Capability.PLAYBACK_CONTROLLER, property: Property.PLAYBACK }];
  }

  /**
   * Returns reportable properties
   * @param  {Array}  items
   * @param  {Object} properties
   * @return {Array}
   */
  getReportableProperties(items, properties) {
    const playbackState = properties[Property.PLAYBACK_STATE];
    const playbackStopState = properties[`${Property.PLAYBACK_STATE}#${PlaybackState.TAG_STOP}`];

    if (playbackStopState) {
      const item = items.find((item) => item.name === playbackStopState.item.name);
      const { state } = playbackStopState.getState(item?.state) || {};
      // Return playback stop state property if in stopped state
      if (state === PlaybackState.STOPPED) {
        return [playbackStopState];
      }
    }

    // Return playback state property otherwise
    return [playbackState];
  }
}
