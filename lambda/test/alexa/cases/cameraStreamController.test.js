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

module.exports = [
  {
    description: 'initialize camera stream',
    directive: {
      header: {
        namespace: 'Alexa.CameraStreamController',
        name: 'InitializeCameraStreams'
      },
      endpoint: {
        endpointId: 'gCamera',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'CameraStreamController',
              property: 'cameraStream',
              parameters: {},
              item: { name: 'cameraStream', type: 'String' }
            }
          ])
        }
      },
      payload: {
        cameraStreams: [
          {
            protocol: 'HLS',
            resolution: { width: 1920, height: 1080 },
            authorizationType: 'NONE',
            videoCodec: 'H264',
            audioCodec: 'AAC'
          }
        ]
      }
    },
    items: [{ name: 'cameraStream', state: 'https://cam.foobar.com/ipcamera.m3u8', type: 'String' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.CameraStreamController',
            name: 'Response'
          },
          payload: {
            cameraStreams: [
              {
                uri: 'https://cam.foobar.com/ipcamera.m3u8',
                protocol: 'HLS',
                resolution: { width: 1920, height: 1080 },
                authorizationType: 'NONE',
                videoCodec: 'H264',
                audioCodec: 'AAC'
              }
            ],
            imageUri: 'https://cam.foobar.com/ipcamera.jpg'
          }
        }
      }
    }
  },
  {
    description: 'initialize camera stream with authentication',
    directive: {
      header: {
        namespace: 'Alexa.CameraStreamController',
        name: 'InitializeCameraStreams'
      },
      endpoint: {
        endpointId: 'cameraStream',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'CameraStreamController',
              property: 'cameraStream',
              parameters: {
                proxyBaseUrl: 'https://cam.foobar.com',
                resolution: '720p',
                username: 'foo',
                password: 'bar'
              },
              item: { name: 'cameraStream', type: 'String' }
            }
          ])
        }
      },
      payload: {
        cameraStreams: [
          {
            protocol: 'HLS',
            resolution: { width: 1280, height: 720 },
            authorizationType: 'BASIC',
            videoCodec: 'H264',
            audioCodec: 'AAC'
          }
        ]
      }
    },
    items: [{ name: 'cameraStream', state: 'https://cam.foobar.com/ipcamera.m3u8', type: 'String' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.CameraStreamController',
            name: 'Response'
          },
          payload: {
            cameraStreams: [
              {
                uri: 'https://foo:bar@cam.foobar.com/ipcamera.m3u8',
                protocol: 'HLS',
                resolution: { width: 1280, height: 720 },
                authorizationType: 'BASIC',
                videoCodec: 'H264',
                audioCodec: 'AAC'
              }
            ],
            imageUri: 'https://foo:bar@cam.foobar.com/ipcamera.jpg'
          }
        }
      }
    }
  },
  {
    description: 'initialize camera stream invalid url error',
    directive: {
      header: {
        namespace: 'Alexa.CameraStreamController',
        name: 'InitializeCameraStreams'
      },
      endpoint: {
        endpointId: 'cameraStream',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'CameraStreamController',
              property: 'cameraStream',
              parameters: {},
              item: { name: 'cameraStream', type: 'String' }
            }
          ])
        }
      },
      payload: {
        cameraStreams: [
          {
            protocol: 'HLS',
            resolution: { width: 1920, height: 1080 },
            authorizationType: 'NONE',
            videoCodec: 'H264',
            audioCodec: 'AAC'
          }
        ]
      }
    },
    items: [{ name: 'cameraStream', state: 'http://192.168.42.42:54321/ipcamera.m3u8', type: 'String' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_VALUE',
            message: 'Could not determine a valid camera stream URL'
          }
        }
      }
    }
  }
];
