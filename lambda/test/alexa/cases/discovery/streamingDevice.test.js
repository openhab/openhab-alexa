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

export default {
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
      }
    },
    {
      type: 'Player',
      name: 'playback1',
      groupNames: ['gStreamingDevice1'],
      metadata: {
        alexa: {
          value: 'Playback',
          config: {
            supportedOperations: 'Play,Pause,Previous,Next,FOOBAR'
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'playbackStop1',
      groupNames: ['gStreamingDevice1'],
      metadata: {
        alexa: {
          value: 'PlaybackStop'
        }
      }
    },
    {
      type: 'String',
      name: 'playbackStep1',
      groupNames: ['gStreamingDevice1'],
      metadata: {
        alexa: {
          // code coverage test for unique supported operation among playback properties
          value: 'PlaybackStep',
          config: {
            actionMappings: 'PLAYBACK_STOP=STOP'
          }
        }
      }
    },
    {
      type: 'Group',
      name: 'gStreamingDevice2',
      label: 'Streaming Device 2',
      metadata: {
        alexa: {
          value: 'StreamingDevice'
        }
      }
    },
    {
      type: 'String',
      name: 'playbackStep2',
      groupNames: ['gStreamingDevice2'],
      metadata: {
        alexa: {
          value: 'PlaybackStep',
          config: {
            PLAY: 'PLAY',
            PAUSE: 'PAUSE',
            STOP: 'STOP',
            START_OVER: 'START_OVER'
          }
        }
      }
    },
    {
      type: 'Player',
      name: 'streamingDevice3',
      label: 'Streaming Device 3',
      metadata: {
        alexa: {
          value: 'StreamingDevice'
        }
      }
    },
    {
      type: 'Player',
      name: 'playback4',
      label: 'Streaming Device Playback 4',
      metadata: {
        alexa: {
          value: 'Playback',
          config: {
            retrievable: false
          }
        }
      }
    }
  ],
  expected: {
    gStreamingDevice1: {
      capabilities: [
        'Alexa.PlaybackController',
        'Alexa.PlaybackStateReporter.playbackState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['STREAMING_DEVICE'],
      friendlyName: 'Streaming Device 1',
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Play', 'Pause', 'Previous', 'Next', 'Stop']
      },
      cookie: [
        {
          name: 'PlaybackController',
          property: 'playback',
          parameters: { supportedOperations: ['Play', 'Pause', 'Previous', 'Next'] },
          item: { name: 'playback1', type: 'Player' }
        },
        {
          name: 'PlaybackStateReporter',
          property: 'playbackState',
          parameters: {},
          item: { name: 'playback1', type: 'Player' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackStop',
          parameters: {},
          item: { name: 'playbackStop1', type: 'Switch' }
        },
        {
          name: 'PlaybackStateReporter',
          property: 'playbackState',
          tag: 'stop',
          parameters: {},
          item: { name: 'playbackStop1', type: 'Switch' }
        }
      ]
    },
    gStreamingDevice2: {
      capabilities: ['Alexa.PlaybackController', 'Alexa'],
      displayCategories: ['STREAMING_DEVICE'],
      friendlyName: 'Streaming Device 2',
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Play', 'Pause', 'Stop', 'StartOver']
      },
      cookie: [
        {
          name: 'PlaybackController',
          property: 'playbackStep',
          parameters: {
            PLAY: 'PLAY',
            PAUSE: 'PAUSE',
            STOP: 'STOP',
            START_OVER: 'START_OVER'
          },
          item: { name: 'playbackStep2', type: 'String' }
        }
      ]
    },
    streamingDevice3: {
      capabilities: [
        'Alexa.PlaybackController',
        'Alexa.PlaybackStateReporter.playbackState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['STREAMING_DEVICE'],
      friendlyName: 'Streaming Device 3',
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Play', 'Pause', 'Previous', 'Next', 'Rewind', 'FastForward']
      }
    },
    playback4: {
      capabilities: ['Alexa.PlaybackController', 'Alexa'],
      displayCategories: ['STREAMING_DEVICE'],
      friendlyName: 'Streaming Device Playback 4',
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Play', 'Pause', 'Previous', 'Next', 'Rewind', 'FastForward']
      }
    }
  }
};
