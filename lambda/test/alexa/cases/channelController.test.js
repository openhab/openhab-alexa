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
    description: 'change channel by number value out of range error',
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
              parameters: { range: [100, 499] },
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
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'VALUE_OUT_OF_RANGE',
            message: 'The channel cannot be changed to 1234.',
            validRange: {
              minimumValue: 100,
              maximumValue: 499
            }
          }
        }
      }
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
              parameters: { channelMappings: { 12: 'FOO', 34: 'BAR', 56: 'BAZ' } },
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channel: {},
        channelMetadata: {
          name: 'baz'
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
    description: 'change channel by name invalid value error',
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
              parameters: { channelMappings: { 12: 'FOO', 34: 'BAR' } },
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channel: {},
        channelMetadata: {
          name: 'baz'
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
            message: 'The channel cannot be changed to baz.'
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
              parameters: {},
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channelCount: 1
      }
    },
    items: [
      { name: 'channel', state: '41', type: 'Number' },
      { name: 'channel', state: '42', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ChannelController',
              name: 'channel',
              value: {
                number: '42'
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
      openhab: [{ name: 'channel', value: 42 }]
    }
  },
  {
    description: 'skip channel invalid value error',
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
              parameters: { retrievable: false },
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channelCount: 1
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
              parameters: {},
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channelCount: 1
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
    description: 'skip channel value out of range error',
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
              parameters: {},
              item: { name: 'channel', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        channelCount: -1
      }
    },
    items: [{ name: 'channel', state: '1', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'VALUE_OUT_OF_RANGE',
            message: 'The channel cannot be adjusted to 0.',
            validRange: {
              minimumValue: 1,
              maximumValue: 9999
            }
          }
        }
      }
    }
  }
];
