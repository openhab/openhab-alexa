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

module.exports = [
  {
    description: 'set bands',
    directive: {
      header: {
        namespace: 'Alexa.EqualizerController',
        name: 'SetBands'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'Speaker',
              property: 'volume',
              parameters: {},
              item: { name: 'speakerVolume', type: 'Dimmer' }
            },
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'bass',
              parameters: { range: [-5, 5] },
              item: { name: 'equalizerBass', type: 'Number' }
            },
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'treble',
              parameters: { range: [-5, 5] },
              item: { name: 'equalizerTreble', type: 'Number' }
            },
            {
              name: 'EqualizerController',
              property: 'mode',
              parameters: { supportedModes: ['MOVIE', 'TV'] },
              item: { name: 'equalizerMode', type: 'String' }
            }
          ])
        }
      },
      payload: {
        bands: [{ name: 'BASS', level: -2 }]
      }
    },
    items: [
      { name: 'speakerVolume', state: '50', type: 'Dimmer' },
      { name: 'equalizerBass', state: '-2', type: 'Number' },
      { name: 'equalizerTreble', state: '2', type: 'Number' },
      { name: 'equalizerMode', state: 'movie', type: 'String' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Speaker',
              name: 'volume',
              value: 50
            },
            {
              namespace: 'Alexa.EqualizerController',
              name: 'bands',
              value: [
                {
                  name: 'BASS',
                  value: -2
                },
                {
                  name: 'TREBLE',
                  value: 2
                }
              ]
            },
            {
              namespace: 'Alexa.EqualizerController',
              name: 'mode',
              value: 'MOVIE'
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
        commands: [{ name: 'equalizerBass', value: -2 }]
      }
    }
  },
  {
    description: 'adjust bands with level delta',
    directive: {
      header: {
        namespace: 'Alexa.EqualizerController',
        name: 'AdjustBands'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'bass',
              parameters: { range: [-5, 5] },
              item: { name: 'equalizerBass', type: 'Number' }
            },
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'treble',
              parameters: { range: [-5, 5] },
              item: { name: 'equalizerTreble', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        bands: [{ name: 'BASS', levelDelta: 7, levelDirection: 'DOWN' }]
      }
    },
    items: [
      { name: 'equalizerBass', state: '1', type: 'Number' },
      { name: 'equalizerBass', state: '-5', type: 'Number' },
      { name: 'equalizerTreble', state: '2', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.EqualizerController',
              name: 'bands',
              value: [
                {
                  name: 'BASS',
                  value: -5
                },
                {
                  name: 'TREBLE',
                  value: 2
                }
              ]
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
        commands: [{ name: 'equalizerBass', value: -5 }]
      }
    }
  },
  {
    description: 'adjust bands number item no level delta with increment',
    directive: {
      header: {
        namespace: 'Alexa.EqualizerController',
        name: 'AdjustBands'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'bass',
              parameters: { range: [-5, 5], increment: 3 },
              item: { name: 'equalizerBass', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        bands: [{ name: 'BASS', levelDirection: 'DOWN' }]
      }
    },
    items: [
      { name: 'equalizerBass', state: '1', type: 'Number' },
      { name: 'equalizerBass', state: '-2', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.EqualizerController',
              name: 'bands',
              value: [
                {
                  name: 'BASS',
                  value: -2
                }
              ]
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
        commands: [{ name: 'equalizerBass', value: -2 }]
      }
    }
  },
  {
    description: 'adjust bands number item no level delta/increment',
    directive: {
      header: {
        namespace: 'Alexa.EqualizerController',
        name: 'AdjustBands'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'bass',
              parameters: { range: [-5, 5] },
              item: { name: 'equalizerBass', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        bands: [{ name: 'BASS', levelDirection: 'UP' }]
      }
    },
    items: [
      { name: 'equalizerBass', state: '1', type: 'Number' },
      { name: 'equalizerBass', state: '2', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.EqualizerController',
              name: 'bands',
              value: [
                {
                  name: 'BASS',
                  value: 2
                }
              ]
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
        commands: [{ name: 'equalizerBass', value: 2 }]
      }
    }
  },
  {
    description: 'adjust bands up dimmer item no level delta/increment',
    directive: {
      header: {
        namespace: 'Alexa.EqualizerController',
        name: 'AdjustBands'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'bass',
              parameters: {},
              item: { name: 'equalizerBass', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        bands: [{ name: 'BASS', levelDirection: 'UP' }]
      }
    },
    items: [
      { name: 'equalizerBass', state: '50', type: 'Dimmer' },
      { name: 'equalizerBass', state: '60', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.EqualizerController',
              name: 'bands',
              value: [
                {
                  name: 'BASS',
                  value: 60
                }
              ]
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
        commands: [{ name: 'equalizerBass', value: 'INCREASE' }]
      }
    }
  },
  {
    description: 'adjust bands down dimmer item no level delta/increment',
    directive: {
      header: {
        namespace: 'Alexa.EqualizerController',
        name: 'AdjustBands'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'bass',
              parameters: {},
              item: { name: 'equalizerBass', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        bands: [{ name: 'BASS', levelDirection: 'DOWN' }]
      }
    },
    items: [
      { name: 'equalizerBass', state: '50', type: 'Dimmer' },
      { name: 'equalizerBass', state: '40', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.EqualizerController',
              name: 'bands',
              value: [
                {
                  name: 'BASS',
                  value: 40
                }
              ]
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
        commands: [{ name: 'equalizerBass', value: 'DECREASE' }]
      }
    }
  },
  {
    description: 'adjust bands invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.EqualizerController',
        name: 'AdjustBands'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'bass',
              parameters: { range: [-5, 5], retrievable: false },
              item: { name: 'equalizerBass', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        bands: [{ name: 'BASS', levelDelta: 7, levelDirection: 'DOWN' }]
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
            message: 'Cannot retrieve state for item equalizerBass.'
          }
        }
      }
    }
  },
  {
    description: 'adjust bands endpoint unreachable error',
    directive: {
      header: {
        namespace: 'Alexa.EqualizerController',
        name: 'AdjustBands'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'bass',
              parameters: { range: [-5, 5] },
              item: { name: 'equalizerBass', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        bands: [{ name: 'BASS', levelDelta: 7, levelDirection: 'DOWN' }]
      }
    },
    items: [{ name: 'equalizerBass', state: 'NULL', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Could not get numeric state for item equalizerBass.'
          }
        }
      }
    }
  },
  {
    description: 'reset bands',
    directive: {
      header: {
        namespace: 'Alexa.EqualizerController',
        name: 'ResetBands'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'EqualizerController',
              property: 'bands',
              component: 'bass',
              parameters: { range: [-5, 5], defaultLevel: 1 },
              item: { name: 'equalizerBass', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        bands: [{ name: 'BASS' }]
      }
    },
    items: [{ name: 'equalizerBass', state: '1', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.EqualizerController',
              name: 'bands',
              value: [
                {
                  name: 'BASS',
                  value: 1
                }
              ]
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
        commands: [{ name: 'equalizerBass', value: 1 }]
      }
    }
  },
  {
    description: 'set mode',
    directive: {
      header: {
        namespace: 'Alexa.EqualizerController',
        name: 'SetMode'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'EqualizerController',
              property: 'mode',
              parameters: { supportedModes: ['MOVIE', 'TV'] },
              item: { name: 'equalizerMode', type: 'String' }
            }
          ])
        }
      },
      payload: {
        mode: 'MOVIE'
      }
    },
    items: [{ name: 'equalizerMode', state: 'movie', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.EqualizerController',
              name: 'mode',
              value: 'MOVIE'
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
        commands: [{ name: 'equalizerMode', value: 'movie' }]
      }
    }
  }
];
