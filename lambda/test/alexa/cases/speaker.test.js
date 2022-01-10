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
    description: 'set volume',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'SetVolume'
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
            }
          ])
        }
      },
      payload: {
        volume: 50
      }
    },
    items: [{ name: 'speakerVolume', state: '50', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Speaker',
              name: 'volume',
              value: 50
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
        commands: [{ name: 'speakerVolume', value: 50 }]
      }
    }
  },
  {
    description: 'set volume invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'SetVolume'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'Speaker',
              property: 'muted',
              parameters: {},
              item: { name: 'speakerMute', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        volume: 50
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
            message: 'No volume property defined.'
          }
        }
      }
    }
  },
  {
    description: 'adjust volume no default',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'AdjustVolume'
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
            }
          ])
        }
      },
      payload: {
        volume: 10,
        volumeDefault: false
      }
    },
    items: [
      { name: 'speakerVolume', state: '40', type: 'Dimmer' },
      { name: 'speakerVolume', state: '50', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Speaker',
              name: 'volume',
              value: 50
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
        commands: [{ name: 'speakerVolume', value: 50 }]
      }
    }
  },
  {
    description: 'adjust volume default no increment parameter',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'AdjustVolume'
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
            }
          ])
        }
      },
      payload: {
        volume: -10,
        volumeDefault: true
      }
    },
    items: [
      { name: 'speakerVolume', state: '50', type: 'Dimmer' },
      { name: 'speakerVolume', state: '40', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Speaker',
              name: 'volume',
              value: 40
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
        commands: [{ name: 'speakerVolume', value: 40 }]
      }
    }
  },
  {
    description: 'adjust volume up default with increment parameter',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'AdjustVolume'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'Speaker',
              property: 'volume',
              parameters: { increment: 5 },
              item: { name: 'speakerVolume', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        volume: 10,
        volumeDefault: true
      }
    },
    items: [
      { name: 'speakerVolume', state: '45', type: 'Dimmer' },
      { name: 'speakerVolume', state: '50', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Speaker',
              name: 'volume',
              value: 50
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
        commands: [{ name: 'speakerVolume', value: 50 }]
      }
    }
  },
  {
    description: 'adjust volume down default with increment parameter',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'AdjustVolume'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'Speaker',
              property: 'volume',
              parameters: { increment: 5 },
              item: { name: 'speakerVolume', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        volume: -10,
        volumeDefault: true
      }
    },
    items: [
      { name: 'speakerVolume', state: '50', type: 'Dimmer' },
      { name: 'speakerVolume', state: '45', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Speaker',
              name: 'volume',
              value: 45
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
        commands: [{ name: 'speakerVolume', value: 45 }]
      }
    }
  },
  {
    description: 'adjust volume no property invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'AdjustVolume'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'Speaker',
              property: 'muted',
              parameters: {},
              item: { name: 'speakerMute', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        volume: -10,
        volumeDefault: true
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
            message: 'No volume property defined.'
          }
        }
      }
    }
  },
  {
    description: 'adjust volume not retrievable invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'AdjustVolume'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'Speaker',
              property: 'volume',
              parameters: { increment: 5, retrievable: false },
              item: { name: 'speakerVolume', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        volume: -10,
        volumeDefault: true
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
            message: 'Cannot retrieve state for item speakerVolume.'
          }
        }
      }
    }
  },
  {
    description: 'adjust volume endpoint unreachable error',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'AdjustVolume'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'Speaker',
              property: 'volume',
              parameters: { increment: 5 },
              item: { name: 'speakerVolume', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        volume: -10,
        volumeDefault: true
      }
    },
    items: [{ name: 'speakerVolume', state: 'NULL', type: 'Dimmer' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Could not get numeric state for item speakerVolume.'
          }
        }
      }
    }
  },
  {
    description: 'set mute',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'SetMute'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'Speaker',
              property: 'muted',
              parameters: {},
              item: { name: 'speakerMute', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        mute: true
      }
    },
    items: [{ name: 'speakerMute', state: 'ON', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Speaker',
              name: 'muted',
              value: true
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
        commands: [{ name: 'speakerMute', value: 'ON' }]
      }
    }
  },
  {
    description: 'set mute inverted',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'SetMute'
      },
      endpoint: {
        endpointId: 'gSpeaker',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'Speaker',
              property: 'muted',
              parameters: { inverted: true },
              item: { name: 'speakerMute', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        mute: true
      }
    },
    items: [{ name: 'speakerMute', state: 'OFF', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Speaker',
              name: 'muted',
              value: true
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
        commands: [{ name: 'speakerMute', value: 'OFF' }]
      }
    }
  },
  {
    description: 'set mute invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.Speaker',
        name: 'SetMute'
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
            }
          ])
        }
      },
      payload: {
        mute: true
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
            message: 'No muted property defined.'
          }
        }
      }
    }
  }
];
