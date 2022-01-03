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

const { parseUrl } = require('@root/utils');
const { Interface, Property } = require('../constants');
const { InvalidValueError } = require('../errors');
const AlexaHandler = require('./handler');

/**
 * Defines Alexa.CameraStreamController interface handler class
 *  https://developer.amazon.com/docs/device-apis/alexa-camerastreamcontroller.html#directives
 * @extends AlexaHandler
 */
class CameraStreamController extends AlexaHandler {
  /**
   * Defines initialize camera streams directive
   * @type {String}
   */
  static INITIALIZE_CAMERA_STREAMS = 'InitializeCameraStreams';

  /**
   * Defines handler namespace
   * @return {String}
   */
  static get namespace() {
    return Interface.ALEXA_CAMERA_STREAM_CONTROLLER;
  }

  /**
   * Defines handler supported directives
   * @return {Object}
   */
  static get directives() {
    return {
      [CameraStreamController.INITIALIZE_CAMERA_STREAMS]: this.initializeCameraStreams
    };
  }

  /**
   * Initializes camera streams
   * @param  {Object}  directive
   * @param  {Object}  openhab
   * @return {Promise}
   */
  static async initializeCameraStreams(directive, openhab) {
    const { item, proxyBaseUrl } = directive.endpoint.getCapabilityProperty({
      interface: directive.namespace,
      property: Property.CAMERA_STREAM
    });
    const { protocol, resolution, authorizationType, videoCodec, audioCodec } = directive.payload.cameraStreams[0];
    // Determine camera stream url based on item current state
    const streamUrl = await openhab.getItemState(item.name).then((state) => parseUrl(state, proxyBaseUrl));

    // Throw invalid value error if camera stream url not defined, not https protocol or has non-standard port
    if (!streamUrl || streamUrl.protocol !== 'https:' || streamUrl.port) {
      throw new InvalidValueError('Could not determine a valid camera stream URL');
    }

    // Return directive response including camera stream and image information
    return directive.response({
      namespace: directive.namespace,
      payload: {
        cameraStreams: [
          {
            uri: streamUrl.href,
            protocol,
            resolution,
            authorizationType,
            videoCodec,
            audioCodec
          }
        ],
        imageUri: streamUrl.href.replace(/\.\w+$/, '.jpg')
      }
    });
  }
}

module.exports = CameraStreamController;
