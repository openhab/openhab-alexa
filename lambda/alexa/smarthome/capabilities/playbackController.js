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
import AlexaDisplayCategory from '../category.js';
import { Capability, Interface, Property } from '../constants.js';
import { Playback, PlaybackStop, PlaybackStep, PlaybackAction } from '../properties/index.js';

/**
 * Defines Alexa.PlaybackController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-playbackcontroller.html
 * @extends AlexaCapability
 */
export default class PlaybackController extends AlexaCapability {
  /**
   * Returns name
   * @return {String}
   */
  static get name() {
    return Capability.PLAYBACK_CONTROLLER;
  }

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
      [Property.PLAYBACK_STEP]: PlaybackStep,
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
