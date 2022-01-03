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

module.exports = {
  description: 'camera',
  items: [
    {
      type: 'String',
      name: 'camera1',
      label: 'Camera 1',
      metadata: {
        alexa: {
          value: 'Camera',
          config: {
            proxyBaseUrl: 'https://openhab.myserver.tld'
          }
        }
      }
    },
    {
      type: 'String',
      name: 'camera2',
      label: 'Camera 2',
      metadata: {
        alexa: {
          value: 'Camera',
          config: {
            proxyBaseUrl: 'https://openhab.myserver.tld',
            resolution: '720p'
          }
        }
      }
    },
    {
      type: 'String',
      name: 'camera3',
      label: 'Camera 3',
      metadata: {
        alexa: {
          value: 'CameraStream',
          config: {
            proxyBaseUrl: 'https://openhab.myserver.tld'
          }
        }
      }
    },
    {
      type: 'String',
      name: 'camera99',
      label: 'Camera Invalid',
      metadata: {
        alexa: {
          value: 'Camera',
          config: {
            resolution: 42 // should be converted to string
          }
        }
      }
    }
  ],
  expected: {
    camera1: {
      capabilities: ['Alexa.CameraStreamController', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['CAMERA'],
      friendlyName: 'Camera 1',
      parameters: {
        'Alexa.CameraStreamController.cameraStreamConfigurations': [
          {
            protocols: ['HLS'],
            resolutions: [{ width: 1920, height: 1080 }],
            authorizationTypes: ['NONE'],
            videoCodecs: ['H264'],
            audioCodecs: ['AAC']
          }
        ]
      }
    },
    camera2: {
      capabilities: ['Alexa.CameraStreamController', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['CAMERA'],
      friendlyName: 'Camera 2',
      parameters: {
        'Alexa.CameraStreamController.cameraStreamConfigurations': [
          {
            protocols: ['HLS'],
            resolutions: [{ width: 1280, height: 720 }],
            authorizationTypes: ['NONE'],
            videoCodecs: ['H264'],
            audioCodecs: ['AAC']
          }
        ]
      }
    },
    camera3: {
      capabilities: ['Alexa.CameraStreamController', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['CAMERA'],
      friendlyName: 'Camera 3',
      parameters: {
        'Alexa.CameraStreamController.cameraStreamConfigurations': [
          {
            protocols: ['HLS'],
            resolutions: [{ width: 1920, height: 1080 }],
            authorizationTypes: ['NONE'],
            videoCodecs: ['H264'],
            audioCodecs: ['AAC']
          }
        ]
      }
    }
  }
};
