/**
 * Copyright (c) 2010-2025 Contributors to the openHAB project
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
    description: 'change channel by number',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: {},
              item: { name: 'channel', type: 'Number' }
            }
          ]
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
      openhab: {
        commands: [{ name: 'channel', value: '1234' }]
      }
    }
  },
  {
    description: 'change channel by number supported parameter',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { supportsChannelNumber: true },
              item: { name: 'channel', type: 'String' }
            }
          ]
        }
      },
      payload: {
        channel: {
          number: '12-34'
        },
        channelMetadata: {}
      }
    },
    items: [{ name: 'channel', state: '12-34', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ChannelController',
              name: 'channel',
              value: {
                number: '12-34'
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
        commands: [{ name: 'channel', value: '12-34' }]
      }
    }
  },
  {
    description: 'change channel by number invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { foo1: 'FOO 1', foo2: 'FOO 2' } },
              item: { name: 'channel', type: 'String' }
            }
          ]
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
            type: 'INVALID_VALUE',
            message: 'The channel cannot be changed to 1234.'
          }
        }
      }
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
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { range: [100, 499] },
              item: { name: 'channel', type: 'Number' }
            }
          ]
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
    description: 'change channel by name number item',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { 12: 'FOO 1', 34: 'FOO 2' } },
              item: { name: 'channel', type: 'Number' }
            }
          ]
        }
      },
      payload: {
        channel: {},
        channelMetadata: {
          name: 'foo'
        }
      }
    },
    items: [{ name: 'channel', state: '12', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ChannelController',
              name: 'channel',
              value: {
                number: '12',
                callSign: 'FOO 1'
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
        commands: [{ name: 'channel', value: '12' }]
      }
    }
  },
  {
    description: 'change channel by name string item',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { foo1: 'FOO 1', foo2: 'FOO 2' } },
              item: { name: 'channel', type: 'String' }
            }
          ]
        }
      },
      payload: {
        channel: {},
        channelMetadata: {
          name: 'foo2'
        }
      }
    },
    items: [{ name: 'channel', state: 'foo2', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ChannelController',
              name: 'channel',
              value: {
                callSign: 'FOO 2'
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
        commands: [{ name: 'channel', value: 'foo2' }]
      }
    }
  },
  {
    description: 'change channel by name undefined invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { 12: 'FOO 1', 34: 'FOO 2' } },
              item: { name: 'channel', type: 'Number' }
            }
          ]
        }
      },
      payload: {
        channel: {},
        channelMetadata: {
          name: 'bar'
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
            message: 'The channel cannot be changed to bar.'
          }
        }
      }
    }
  },
  {
    description: 'change channel by name number item invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { foo1: 'FOO 1', foo2: 'FOO 2' } },
              item: { name: 'channel', type: 'Number' }
            }
          ]
        }
      },
      payload: {
        channel: {},
        channelMetadata: {
          name: 'foo.2'
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
            message: 'The channel cannot be changed to foo2.'
          }
        }
      }
    }
  },
  {
    description: 'change channel no property invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'ChangeChannel'
      },
      endpoint: {
        endpointId: 'channelStep',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channelStep',
              parameters: { CHANNEL_UP: 'CHUP', CHANNEL_DOWN: 'CHDOWN' },
              item: { name: 'channelStep', type: 'String' }
            }
          ]
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
            type: 'INVALID_VALUE',
            message: 'No channel property defined.'
          }
        }
      }
    }
  },
  {
    description: 'skip channel number item',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'SkipChannels'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: {},
              item: { name: 'channel', type: 'Number' }
            }
          ]
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
      openhab: {
        commands: [{ name: 'channel', value: 42 }]
      }
    }
  },
  {
    description: 'skip channel string item',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'SkipChannels'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { foo1: 'FOO 1', foo2: 'FOO 2' } },
              item: { name: 'channel', type: 'String' }
            }
          ]
        }
      },
      payload: {
        channelCount: 1
      }
    },
    items: [
      { name: 'channel', state: 'foo1', type: 'String' },
      { name: 'channel', state: 'foo2', type: 'String' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ChannelController',
              name: 'channel',
              value: {
                callSign: 'FOO 2'
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
        commands: [{ name: 'channel', value: 'foo2' }]
      }
    }
  },
  {
    description: 'skip channel step up',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'SkipChannels'
      },
      endpoint: {
        endpointId: 'channelStep',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channelStep',
              parameters: { CHANNEL_UP: 'CHUP', CHANNEL_DOWN: 'CHDOWN' },
              item: { name: 'channelStep', type: 'String' }
            }
          ]
        }
      },
      payload: {
        channelCount: 1
      }
    },
    expected: {
      alexa: {
        context: {},
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'channelStep', value: 'CHUP' }]
      }
    }
  },
  {
    description: 'skip channel step down',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'SkipChannels'
      },
      endpoint: {
        endpointId: 'channelStep',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channelStep',
              parameters: { CHANNEL_UP: 'CHUP', CHANNEL_DOWN: 'CHDOWN' },
              item: { name: 'channelStep', type: 'String' }
            }
          ]
        }
      },
      payload: {
        channelCount: -1
      }
    },
    expected: {
      alexa: {
        context: {},
        event: {
          header: {
            namespace: 'Alexa',
            name: 'Response'
          }
        }
      },
      openhab: {
        commands: [{ name: 'channelStep', value: 'CHDOWN' }]
      }
    }
  },
  {
    description: 'skip channel no mapping defined invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'SkipChannels'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { channelMappings: { foo1: 'FOO 1', foo2: 'FOO 2' } },
              item: { name: 'channel', type: 'String' }
            }
          ]
        }
      },
      payload: {
        channelCount: -1
      }
    },
    items: [{ name: 'channel', state: 'bar', type: 'String' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_VALUE',
            message: 'Current channel bar is not defined in channel mappings.'
          }
        }
      }
    }
  },
  {
    description: 'skip channel not retrievable invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ChannelController',
        name: 'SkipChannels'
      },
      endpoint: {
        endpointId: 'channel',
        cookie: {
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: { retrievable: false },
              item: { name: 'channel', type: 'Number' }
            }
          ]
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
          capabilities: [
            {
              name: 'ChannelController',
              property: 'channel',
              parameters: {},
              item: { name: 'channel', type: 'Number' }
            }
          ]
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
  }
];
