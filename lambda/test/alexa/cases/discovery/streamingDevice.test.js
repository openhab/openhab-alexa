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

module.exports = {
  description: 'streming device',
  items: [
    {
      type: 'Group',
      name: 'gStreamingDevice1',
      label: 'Streaming Device 1',
      metadata: {
        alexa: {
          value: 'StreamingDevice'
        }
      },
      members: [
        {
          type: 'String',
          name: 'navigation1',
          metadata: {
            alexa: {
              value: 'Navigation',
              config: {
                supportedKeys: 'UP,DOWN,LEFT,RIGHT,SELECT,FOOBAR'
              }
            }
          }
        },
        {
          type: 'Player',
          name: 'playback1',
          metadata: {
            alexa: {
              value: 'Playback',
              config: {
                supportedOperations: 'Play,Pause,Next,Previous,FOOBAR'
              }
            }
          }
        },
        {
          type: 'Switch',
          name: 'playbackStop1',
          metadata: {
            alexa: {
              value: 'PlaybackStop'
            }
          }
        },
        {
          type: 'Switch',
          name: 'playbackAction1',
          metadata: {
            alexa: {
              // code coverage test for unique supported operation among playback properties
              value: 'PlaybackController.playbackAction',
              config: {
                actionMappings: 'Stop=OFF'
              }
            }
          }
        }
      ]
    },
    {
      type: 'Player',
      name: 'streamingDevice2',
      label: 'Streaming Device 2',
      metadata: {
        alexa: {
          value: 'StreamingDevice'
        }
      }
    },
    {
      type: 'String',
      name: 'navigation3',
      label: 'Streaming Device Navigation 3',
      metadata: {
        alexa: {
          value: 'Navigation'
        }
      }
    },
    {
      type: 'Player',
      name: 'playback3',
      label: 'Streaming Device Playback 3',
      metadata: {
        alexa: {
          value: 'Playback'
        }
      }
    }
  ],
  expected: {
    gStreamingDevice1: {
      capabilities: ['Alexa.KeypadController', 'Alexa.PlaybackController', 'Alexa'],
      displayCategories: ['STREAMING_DEVICE'],
      friendlyName: 'Streaming Device 1',
      parameters: {
        'Alexa.KeypadController.keys': ['UP', 'DOWN', 'LEFT', 'RIGHT', 'SELECT'],
        'Alexa.PlaybackController.supportedOperations': ['Play', 'Pause', 'Next', 'Previous', 'Stop']
      },
      cookie: [
        {
          name: 'KeypadController',
          property: 'keystroke',
          parameters: { supportedKeys: ['UP', 'DOWN', 'LEFT', 'RIGHT', 'SELECT'] },
          item: { name: 'navigation1', type: 'String' }
        },
        {
          name: 'PlaybackController',
          property: 'playback',
          parameters: { supportedOperations: ['Play', 'Pause', 'Next', 'Previous'] },
          item: { name: 'playback1', type: 'Player' }
        }
      ]
    },
    streamingDevice2: {
      capabilities: ['Alexa.PlaybackController', 'Alexa'],
      displayCategories: ['STREAMING_DEVICE'],
      friendlyName: 'Streaming Device 2'
    },
    navigation3: {
      capabilities: ['Alexa.KeypadController', 'Alexa'],
      displayCategories: ['STREAMING_DEVICE'],
      friendlyName: 'Streaming Device Navigation 3',
      parameters: {
        'Alexa.KeypadController.keys': [
          'UP',
          'DOWN',
          'LEFT',
          'RIGHT',
          'SELECT',
          'PAGE_UP',
          'PAGE_DOWN',
          'PAGE_LEFT',
          'PAGE_RIGHT',
          'INFO',
          'MORE',
          'BACK'
        ]
      }
    },
    playback3: {
      capabilities: ['Alexa.PlaybackController', 'Alexa'],
      displayCategories: ['STREAMING_DEVICE'],
      friendlyName: 'Streaming Device Playback 3',
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Play', 'Pause', 'Next', 'Previous', 'FastForward', 'Rewind']
      }
    }
  }
};
