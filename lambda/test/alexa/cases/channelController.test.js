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
    description: 'change channel by number',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: {},
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channel: {
          number: '1234'
        },
        channelMetadata: {}
      }
    },
    items: [{ name: 'channel', state: '1234', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ChannelController',
              name: 'channel',
              value: {
                number: '1234'
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
      openhab: [{ name: 'channel', value: '1234' }]
    }
  },
  {
    description: 'change channel by name',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { FOO: '12', BAR: '34', BAZ: '56', QUX: '78' } },
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channel: {},
        channelMetadata: {
          name: 'BAZ'
        }
      }
    },
    items: [{ name: 'channel', state: '56', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ChannelController',
              name: 'channel',
              value: {
                number: '56'
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
      openhab: [{ name: 'channel', value: '56' }]
    }
  },
  {
    description: 'change channel invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { FOO: '12', BAR: '34' } },
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channel: {},
        channelMetadata: {
          name: 'BAZ'
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
            message: 'The channel cannot be changed to BAZ.'
          }
        }
      }
    }
  },
  {
    description: 'skip channel',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'SkipChannels'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { FOO: '12', BAR: '34', BAZ: '56', QUX: '78' } },
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channelCount: -2
      }
    },
    items: [
      { name: 'channel', state: '78', type: 'Number' },
      { name: 'channel', state: '34', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ChannelController',
              name: 'channel',
              value: {
                number: '34'
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
      openhab: [{ name: 'channel', value: '34' }]
    }
  },
  {
    description: 'skip channel endpoint unreachable error',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'SkipChannels'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { FOO: '12', BAR: '34', BAZ: '56', QUX: '78' } },
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channelCount: -2
      }
    },
    items: [{ name: 'channel', state: 'NULL', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Could not get numeric state for item channel.'
          }
        }
      }
    }
  },
  {
    description: 'skip channel unretrievable invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'SkipChannels'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { FOO: '12', BAR: '34', BAZ: '56', QUX: '78' }, retrievable: false },
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channelCount: -2
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
            message: 'Cannot retrieve state for item channel.'
          }
        }
      }
    }
  },
  {
    description: 'skip channel missing mapping invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'SkipChannels'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { FOO: '12', BAR: '34', BAZ: '56', QUX: '78' } },
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channelCount: -2
      }
    },
    items: [{ name: 'channel', state: '42', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_VALUE',
            message: 'Current channel number 42 is not defined in channel mappings.'
          }
        }
      }
    }
  }
];
