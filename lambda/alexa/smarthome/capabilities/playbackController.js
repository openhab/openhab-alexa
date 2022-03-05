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

const AlexaCapability = require('./capability');
const AlexaDisplayCategory = require('../category');
const { Interface, Property } = require('../constants');
const { Playback, PlaybackStop, PlaybackAction } = require('../properties');

/**
 * Defines Alexa.PlaybackController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-playbackcontroller.html
 * @extends AlexaCapability
 */
class PlaybackController extends AlexaCapability {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_PLAYBACK_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.PLAYBACK]: Playback,
      [Property.PLAYBACK_STOP]: PlaybackStop,
      [Property.PLAYBACK_ACTION]: PlaybackAction
    };
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return this.hasProperty({ name: Property.PLAYBACK_ACTION })
      ? [AlexaDisplayCategory.OTHER]
      : [AlexaDisplayCategory.STREAMING_DEVICE];
  }

  /**
   * Returns capability interface
   * @return {Object}
   */
  getCapabilityInterface() {
    // Get capability interface from parent method
    const capability = super.getCapabilityInterface();

    // Initialize capability supported operations array
    capability.supportedOperations = [];

    // Iterate over property supported operations
    for (const { supportedOperations } of this.properties) {
      for (const operation of supportedOperations) {
        if (!capability.supportedOperations.includes(operation)) {
          capability.supportedOperations.push(operation);
        }
      }
    }

    return capability;
  }
}

module.exports = PlaybackController;
