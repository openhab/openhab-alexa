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

const { ItemType } = require('@openhab/constants');
const { Parameter, ParameterType } = require('../metadata');
const AlexaProperty = require('./property');

/**
 * Defines camera stream authorization type enum
 *  https://developer.amazon.com/docs/device-apis/alexa-camerastreamcontroller.html#supported-authorization
 * @type {Object}
 */
const AuthType = Object.freeze({
  BASIC: 'BASIC',
  DIGEST: 'DIGEST',
  NONE: 'NONE'
});

/**
 * Defines camera stream protocol enum
 *  https://developer.amazon.com/docs/device-apis/alexa-camerastreamcontroller.html#supported-protocol
 * @type {Object}
 */
const Protocol = Object.freeze({
  HLS: 'HLS',
  RTSP: 'RTSP'
});

/**
 * Defines camera stream resolution enum
 *  https://developer.amazon.com/docs/device-apis/alexa-camerastreamcontroller.html#supported-resolution
 * @type {Object}
 */
const Resolution = Object.freeze({
  ED: '480p',
  HD: '720p',
  FHD: '1080p'
});

/**
 * Defines camera stream video codec enum
 *  https://developer.amazon.com/docs/device-apis/alexa-camerastreamcontroller.html#supported-video
 * @type {Object}
 */
const VideoCodec = Object.freeze({
  H264: 'H264',
  MPEG2: 'MPEG2',
  MJPEG: 'MJPEG',
  JPG: 'JPG'
});

/**
 * Defines camera stream audio codec enum
 *  https://developer.amazon.com/docs/device-apis/alexa-camerastreamcontroller.html#supported-audio
 * @type {Object}
 */
const AudioCodec = Object.freeze({
  G711: 'G711',
  AAC: 'AAC',
  NONE: 'NONE'
});

/**
 * Defines camera stream property class
 * @extends AlexaProperty
 */
class CameraStream extends AlexaProperty {
  /**
   * Returns supported item types
   * @return {Array}
   */
  get supportedItemTypes() {
    return [ItemType.STRING];
  }

  /**
   * Returns supported parameters and their type
   * @return {Object}
   */
  get supportedParameters() {
    return {
      [Parameter.PROXY_BASE_URL]: ParameterType.STRING,
      [Parameter.RESOLUTION]: ParameterType.STRING
    };
  }

  /**
   * Returns if is reportable
   * @return {Boolean}
   */
  get isReportable() {
    return false;
  }

  /**
   * Returns if is valid
   * @return {Boolean}
   */
  get isValid() {
    return !!this.proxyBaseUrl && !!this.resolution;
  }

  /**
   * Returns supported stream resolutions
   * @return {Object}
   */
  get supportedResolutions() {
    return {
      [Resolution.ED]: { width: 640, height: 480 },
      [Resolution.HD]: { width: 1280, height: 720 },
      [Resolution.FHD]: { width: 1920, height: 1080 }
    };
  }

  /**
   * Returns proxy base url based on parameter
   * @return {String}
   */
  get proxyBaseUrl() {
    return this.parameters[Parameter.PROXY_BASE_URL];
  }

  /**
   * Return protocol
   * @return {String}
   */
  get protocol() {
    return Protocol.HLS;
  }

  /**
   * Returns stream resolution based on parameter
   * @return {Object}
   */
  get resolution() {
    return this.supportedResolutions[this.parameters[Parameter.RESOLUTION] || Resolution.FHD];
  }

  /**
   * Returns authorization type
   * @return {String}
   */
  get authorizationType() {
    return AuthType.NONE;
  }

  /**
   * Returns video codec
   * @return {String}
   */
  get videoCodec() {
    return VideoCodec.H264;
  }

  /**
   * Returns audio codec
   * @return {String}
   */
  get audioCodec() {
    return AudioCodec.AAC;
  }
}

module.exports = CameraStream;
