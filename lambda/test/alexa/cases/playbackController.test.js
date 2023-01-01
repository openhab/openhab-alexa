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

export default [
  {
    description: 'play request',
    directive: {
      header: {
        namespace: 'Alexa.PlaybackController',
        name: 'Play'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: [
            {
              name: 'PlaybackController',
              property: 'playback',
              parameters: {},
              item: { name: 'speakerPlayer', type: 'Player' }
            },
            {
              name: 'PlaybackStateReporter',
              property: 'playbackState',
              parameters: {},
              item: { name: 'speakerPlayer', type: 'Player' }
            }
          ]
        }
      }
    },
    items: [{ name: 'speakerPlayer', state: 'PLAY', type: 'Player' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PlaybackStateReporter',
              name: 'playbackState',
              value: {
                state: 'PLAYING'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'speakerPlayer', value: 'PLAY' }]
      }
    }
  },
  {
    description: 'play step request',
    directive: {
      header: {
        namespace: 'Alexa.PlaybackController',
        name: 'Play'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: [
            {
              name: 'PlaybackController',
              property: 'playbackStep',
              parameters: { PLAY: 'PLAY', PAUSE: 'PAUSE' },
              item: { name: 'speakerPlayer', type: 'String' }
            }
          ]
        }
      }
    },
    expected: {
      alexa: {
        context: {
          properties: []
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'speakerPlayer', value: 'PLAY' }]
      }
    }
  },
  {
    description: 'pause request',
    directive: {
      header: {
        namespace: 'Alexa.PlaybackController',
        name: 'Pause'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: [
            {
              name: 'PlaybackController',
              property: 'playback',
              parameters: {},
              item: { name: 'speakerPlayer', type: 'Player' }
            },
            {
              name: 'PlaybackStateReporter',
              property: 'playbackState',
              parameters: {},
              item: { name: 'speakerPlayer', type: 'Player' }
            },
            {
              name: 'PlaybackController',
              property: 'playbackStop',
              parameters: {},
              item: { name: 'speakerPlayerStop', type: 'Switch' }
            },
            {
              name: 'PlaybackStateReporter',
              property: 'playbackState',
              tag: 'stop',
              parameters: {},
              item: { name: 'speakerPlayerStop', type: 'Switch' }
            }
          ]
        }
      }
    },
    items: [
      { name: 'speakerPlayer', state: 'PAUSE', type: 'Player' },
      { name: 'speakerPlayerStop', state: 'OFF', type: 'Switch' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PlaybackStateReporter',
              name: 'playbackState',
              value: {
                state: 'PAUSED'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'speakerPlayer', value: 'PAUSE' }]
      }
    }
  },
  {
    description: 'stop request',
    directive: {
      header: {
        namespace: 'Alexa.PlaybackController',
        name: 'Stop'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: [
            {
              name: 'PlaybackController',
              property: 'playback',
              parameters: {},
              item: { name: 'speakerPlayer', type: 'Player' }
            },
            {
              name: 'PlaybackStateReporter',
              property: 'playbackState',
              parameters: {},
              item: { name: 'speakerPlayer', type: 'Player' }
            },
            {
              name: 'PlaybackController',
              property: 'playbackStop',
              parameters: {},
              item: { name: 'speakerPlayerStop', type: 'Switch' }
            },
            {
              name: 'PlaybackStateReporter',
              property: 'playbackState',
              tag: 'stop',
              parameters: {},
              item: { name: 'speakerPlayerStop', type: 'Switch' }
            }
          ]
        }
      }
    },
    items: [
      { name: 'speakerPlayer', state: 'PLAY', type: 'Player' },
      { name: 'speakerPlayerStop', state: 'ON', type: 'Switch' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PlaybackStateReporter',
              name: 'playbackState',
              value: {
                state: 'STOPPED'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'speakerPlayerStop', value: 'ON' }]
      }
    }
  },
  {
    description: 'stop request inverted',
    directive: {
      header: {
        namespace: 'Alexa.PlaybackController',
        name: 'Stop'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: [
            {
              name: 'PlaybackController',
              property: 'playback',
              parameters: {},
              item: { name: 'speakerPlayer', type: 'Player' }
            },
            {
              name: 'PlaybackStateReporter',
              property: 'playbackState',
              parameters: {},
              item: { name: 'speakerPlayer', type: 'Player' }
            },
            {
              name: 'PlaybackController',
              property: 'playbackStop',
              parameters: { inverted: true },
              item: { name: 'speakerPlayerStop', type: 'Switch' }
            },
            {
              name: 'PlaybackStateReporter',
              property: 'playbackState',
              tag: 'stop',
              parameters: { inverted: true },
              item: { name: 'speakerPlayerStop', type: 'Switch' }
            }
          ]
        }
      }
    },
    items: [
      { name: 'speakerPlayer', state: 'PLAY', type: 'Player' },
      { name: 'speakerPlayerStop', state: 'OFF', type: 'Switch' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PlaybackStateReporter',
              name: 'playbackState',
              value: {
                state: 'STOPPED'
              }
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'speakerPlayerStop', value: 'OFF' }]
      }
    }
  },
  {
    description: 'resume action request',
    directive: {
      header: {
        namespace: 'Alexa.PlaybackController',
        name: 'Play'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: [
            {
              name: 'PlaybackController',
              property: 'playbackAction',
              parameters: { RESUME: 'RESUME', PAUSE: 'PAUSE' },
              item: { name: 'vacuumControl', type: 'String' }
            }
          ]
        }
      }
    },
    expected: {
      alexa: {
        context: {
          properties: []
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'vacuumControl', value: 'RESUME' }]
      }
    }
  },
  {
    description: 'pause action invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.PlaybackController',
        name: 'Pause'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: [
            {
              name: 'PlaybackController',
              property: 'playbackAction',
              parameters: { RESUME: 'RESUME' },
              item: { name: 'vacuumControl', type: 'String' }
            }
          ]
        }
      }
    },
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_VALUE',
            message: 'Playback Pause is not supported.'
          }
        }
      }
    }
  }
];
