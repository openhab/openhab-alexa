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
    description: 'set color temperature dimmer item',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { range: [2700, 6500] },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 2700
      }
    },
    items: [{ name: 'colorTemperature', state: '100', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 2700
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
        commands: [{ name: 'colorTemperature', value: 100 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (hue binding/color range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'hue' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 6500
      }
    },
    items: [{ name: 'colorTemperature', state: '0', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 6500
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
        commands: [{ name: 'colorTemperature', value: 0 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (hue binding/white range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'hue:white' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 2200
      }
    },
    items: [{ name: 'colorTemperature', state: '100', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 2200
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
        commands: [{ name: 'colorTemperature', value: 100 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (lifx binding/color range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'lifx' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 9000
      }
    },
    items: [{ name: 'colorTemperature', state: '0', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 9000
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
        commands: [{ name: 'colorTemperature', value: 0 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (lifx binding/white range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'lifx:white' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 2700
      }
    },
    items: [{ name: 'colorTemperature', state: '100', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 2700
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
        commands: [{ name: 'colorTemperature', value: 100 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (milight binding/color range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'milight' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 6500
      }
    },
    items: [{ name: 'colorTemperature', state: '0', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 6500
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
        commands: [{ name: 'colorTemperature', value: 0 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (milight binding/white range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'milight:white' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 2700
      }
    },
    items: [{ name: 'colorTemperature', state: '100', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 2700
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
        commands: [{ name: 'colorTemperature', value: 100 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (tradfri binding/color range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'tradfri' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 6000
      }
    },
    items: [{ name: 'colorTemperature', state: '0', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 6000
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
        commands: [{ name: 'colorTemperature', value: 0 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (tradfri binding/white range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'tradfri:white' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 2200
      }
    },
    items: [{ name: 'colorTemperature', state: '100', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 2200
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
        commands: [{ name: 'colorTemperature', value: 100 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (tplinksmarthome binding/color range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'tplinksmarthome' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 9000
      }
    },
    items: [{ name: 'colorTemperature', state: '0', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 9000
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
        commands: [{ name: 'colorTemperature', value: 0 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (tplinksmarthome binding/white range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'tplinksmarthome:white' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 2700
      }
    },
    items: [{ name: 'colorTemperature', state: '100', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 2700
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
        commands: [{ name: 'colorTemperature', value: 100 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (yeelight binding/color range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'yeelight' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 6500
      }
    },
    items: [{ name: 'colorTemperature', state: '0', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 6500
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
        commands: [{ name: 'colorTemperature', value: 0 }]
      }
    }
  },
  {
    description: 'set color temperature dimmer item (yeelight binding/white range)',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { binding: 'yeelight:white' },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 2700
      }
    },
    items: [{ name: 'colorTemperature', state: '100', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 2700
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
        commands: [{ name: 'colorTemperature', value: 100 }]
      }
    }
  },
  {
    description: 'set color temperature number item',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: {},
              item: { name: 'colorTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 2700
      }
    },
    items: [{ name: 'colorTemperature', state: '2700', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 2700
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
        commands: [{ name: 'colorTemperature', value: 2700 }]
      }
    }
  },
  {
    description: 'set color temperature not retrievable',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorController',
              property: 'color',
              parameters: { retrievable: false },
              item: { name: 'colorLight', type: 'Color' }
            },
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { retrievable: false },
              item: { name: 'colorTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 2700
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
        commands: [{ name: 'colorTemperature', value: 2700 }]
      }
    }
  },
  {
    description: 'set color temperature out of range error',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'SetColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { range: [2200, 4000] },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        colorTemperatureInKelvin: 5500
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
            message: 'The color temperature cannot be set to 5500K.',
            validRange: {
              minimumValue: 2200,
              maximumValue: 4000
            }
          }
        }
      }
    }
  },
  {
    description: 'increase color temperature dimmer item no increment parameter',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'IncreaseColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: {},
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'colorTemperature', state: '50', type: 'Dimmer' },
      { name: 'colorTemperature', state: '40', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 6400
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
        commands: [{ name: 'colorTemperature', value: 'DECREASE' }]
      }
    }
  },
  {
    description: 'increase color temperature dimmer item with increment parameter',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'IncreaseColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { increment: 10 },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'colorTemperature', state: '50', type: 'Dimmer' },
      { name: 'colorTemperature', state: '40', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 6400
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
        commands: [{ name: 'colorTemperature', value: 40 }]
      }
    }
  },
  {
    description: 'increase color temperature number item no increment parameter',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'IncreaseColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: {},
              item: { name: 'colorTemperature', type: 'Number' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'colorTemperature', state: '5900', type: 'Number' },
      { name: 'colorTemperature', state: '6400', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 6400
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
        commands: [{ name: 'colorTemperature', value: 6400 }]
      }
    }
  },
  {
    description: 'decrease color temperature dimmer item no increment parameter',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'DecreaseColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: {},
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'colorTemperature', state: '40', type: 'Dimmer' },
      { name: 'colorTemperature', state: '50', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 5500
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
        commands: [{ name: 'colorTemperature', value: 'INCREASE' }]
      }
    }
  },
  {
    description: 'decrease color temperature dimmer item with increment parameter',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'DecreaseColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { increment: 10 },
              item: { name: 'colorTemperature', type: 'Dimmer' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'colorTemperature', state: '40', type: 'Dimmer' },
      { name: 'colorTemperature', state: '50', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 5500
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
        commands: [{ name: 'colorTemperature', value: 50 }]
      }
    }
  },
  {
    description: 'decrease color temperature number item with increment parameter',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'DecreaseColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { increment: 900 },
              item: { name: 'colorTemperature', type: 'Number' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'colorTemperature', state: '6400', type: 'Number' },
      { name: 'colorTemperature', state: '5500', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorTemperatureController',
              name: 'colorTemperatureInKelvin',
              value: 5500
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
        commands: [{ name: 'colorTemperature', value: 5500 }]
      }
    }
  },
  {
    description: 'adjust color temperature invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'IncreaseColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { retrievable: false },
              item: { name: 'colorTemperature', type: 'Number' }
            }
          ])
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
            message: 'Cannot retrieve state for item colorTemperature.'
          }
        }
      }
    }
  },
  {
    description: 'adjust color temperature endpoint unreachable error',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'IncreaseColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: {},
              item: { name: 'colorTemperature', type: 'Number' }
            }
          ])
        }
      }
    },
    items: [{ name: 'colorTemperature', state: 'NULL', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Could not get numeric state for item colorTemperature.'
          }
        }
      }
    }
  },
  {
    description: 'adjust color temperature in color mode error',
    directive: {
      header: {
        namespace: 'Alexa.ColorTemperatureController',
        name: 'IncreaseColorTemperature'
      },
      endpoint: {
        endpointId: 'gColorLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorController',
              property: 'color',
              parameters: {},
              item: { name: 'colorLight', type: 'Color' }
            },
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: {},
              item: { name: 'colorTemperature', type: 'Number' }
            }
          ])
        }
      }
    },
    items: [
      { name: 'colorTemperature', state: '0', type: 'Number' },
      { name: 'colorLight', state: '180,50,50', type: 'Color' }
    ],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'NOT_SUPPORTED_IN_CURRENT_MODE',
            message: 'The light is currently set to a color.',
            currentDeviceMode: 'COLOR'
          }
        }
      }
    }
  }
];
