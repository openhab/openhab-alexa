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
const { CameraStream } = require('../properties');

/**
 * Defines Alexa.CameraStreamController interface capability class
 *  https://developer.amazon.com/docs/device-apis/alexa-camerastreamcontroller.html
 * @extends AlexaCapability
 */
class CameraStreamController extends AlexaCapability {
  /**
   * Returns interface
   * @return {String}
   */
  get interface() {
    return Interface.ALEXA_CAMERA_STREAM_CONTROLLER;
  }

  /**
   * Returns supported properties
   * @return {Object}
   */
  get supportedProperties() {
    return {
      [Property.CAMERA_STREAM]: CameraStream
    };
  }

  /**
   * Returns default display categories
   * @return {Array}
   */
  get defaultDisplayCategories() {
    return [AlexaDisplayCategory.CAMERA];
  }

  /**
   * Returns if supports endpoint health
   * @return {Boolean}
   */
  get supportsEndpointHealth() {
    return true;
  }

  /**
   * Returns capability interface
   * @return {Object}
   */
  getCapabilityInterface() {
    // Get capability interface from parent method
    const capability = super.getCapabilityInterface();
    const cameraStream = this.getProperty({ name: Property.CAMERA_STREAM });
    const { protocol, resolution, authorizationType, videoCodec, audioCodec } = cameraStream;

    // Add capability camera stream configurations
    capability.cameraStreamConfigurations = [
      {
        protocols: [protocol],
        resolutions: [resolution],
        authorizationTypes: [authorizationType],
        videoCodecs: [videoCodec],
        audioCodecs: [audioCodec]
      }
    ];

    return capability;
  }
}

module.exports = CameraStreamController;
