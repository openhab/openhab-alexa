/**
 * Copyright (c) 2010-2023 Contributors to the openHAB project
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

export default [
  {
    description: 'initialize camera stream',
    directive: {
      header: {
        namespace: 'Alexa.CameraStreamController',
        name: 'InitializeCameraStreams'
      },
      endpoint: {
        endpointId: 'cameraStream',
        cookie: {
          capabilities: [
            {
              name: 'CameraStreamController',
              property: 'cameraStream',
              parameters: { proxyBaseUrl: 'https://openhab.myserver.tld' },
              item: { name: 'cameraStream', type: 'String' }
            }
          ]
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
    items: [{ name: 'cameraStream', state: 'http://192.168.42.42:8080/ipcamera/cam/ipcamera.m3u8', type: 'String' }],
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
                uri: 'https://openhab.myserver.tld/ipcamera/cam/ipcamera.m3u8',
                protocol: 'HLS',
                resolution: { width: 1920, height: 1080 },
                authorizationType: 'NONE',
                videoCodec: 'H264',
                audioCodec: 'AAC'
              }
            ],
            imageUri: 'https://openhab.myserver.tld/ipcamera/cam/ipcamera.jpg'
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
          capabilities: [
            {
              name: 'CameraStreamController',
              property: 'cameraStream',
              parameters: {
                proxyBaseUrl: 'https://openhab.myserver.tld',
                resolution: '720p',
                username: 'foo',
                password: 'bar'
              },
              item: { name: 'cameraStream', type: 'String' }
            }
          ]
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
    items: [{ name: 'cameraStream', state: 'http://192.168.42.42:8080/ipcamera/cam/ipcamera.m3u8', type: 'String' }],
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
                uri: 'https://foo:bar@openhab.myserver.tld/ipcamera/cam/ipcamera.m3u8',
                protocol: 'HLS',
                resolution: { width: 1280, height: 720 },
                authorizationType: 'BASIC',
                videoCodec: 'H264',
                audioCodec: 'AAC'
              }
            ],
            imageUri: 'https://foo:bar@openhab.myserver.tld/ipcamera/cam/ipcamera.jpg'
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
          capabilities: [
            {
              name: 'CameraStreamController',
              property: 'cameraStream',
              parameters: { proxyBaseUrl: 'https://openhab.myserver.tld:8443' },
              item: { name: 'cameraStream', type: 'String' }
            }
          ]
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
    items: [{ name: 'cameraStream', state: 'http://192.168.42.42:8080/ipcamera/cam/ipcamera.m3u8', type: 'String' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'NOT_SUPPORTED_IN_CURRENT_MODE',
            message: 'Invalid camera stream URL',
            currentDeviceMode: 'NOT_PROVISIONED'
          }
        }
      }
    }
  }
];
