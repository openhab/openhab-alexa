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
    description: 'set color',
    directive: {
      header: {
        namespace: 'Alexa.ColorController',
        name: 'SetColor'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorController',
              property: 'color',
              parameters: {},
              item: { name: 'light1', type: 'Color' }
            }
          ])
        }
      },
      payload: {
        color: {
          hue: 350.5,
          saturation: 0.7138,
          brightness: 0.6524
        }
      }
    },
    items: [
      { name: 'light1', state: 'NULL', type: 'Color' },
      { name: 'light1', state: '350.5,71.38,65.24', type: 'Color' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorController',
              name: 'color',
              value: {
                hue: 350.5,
                saturation: 0.7138,
                brightness: 0.6524
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
        commands: [{ name: 'light1', value: '350.5,71.38,65.24' }]
      }
    }
  },
  {
    description: 'set color maintain brightness level',
    directive: {
      header: {
        namespace: 'Alexa.ColorController',
        name: 'SetColor'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorController',
              property: 'color',
              parameters: {},
              item: { name: 'light1', type: 'Color' }
            }
          ])
        }
      },
      payload: {
        color: {
          hue: 350.5,
          saturation: 0.7138,
          brightness: 0.6524
        }
      }
    },
    items: [
      { name: 'light1', state: '100,100,100', type: 'Color' },
      { name: 'light1', state: '350.5,71.38,100', type: 'Color' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorController',
              name: 'color',
              value: {
                hue: 350.5,
                saturation: 0.7138,
                brightness: 1
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
        commands: [{ name: 'light1', value: '350.5,71.38,100' }]
      }
    }
  },
  {
    description: 'set color state not retrievable',
    directive: {
      header: {
        namespace: 'Alexa.ColorController',
        name: 'SetColor'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorController',
              property: 'color',
              parameters: { retrievable: false },
              item: { name: 'light1', type: 'Color' }
            }
          ])
        }
      },
      payload: {
        color: {
          hue: 350.5,
          saturation: 0.7138,
          brightness: 0.6524
        }
      }
    },
    items: [{ name: 'light1', state: '350.5,71.38,65.24', type: 'Color' }],
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
        commands: [{ name: 'light1', value: '350.5,71.38,65.24' }]
      }
    }
  },
  {
    description: 'set color reset temperature',
    directive: {
      header: {
        namespace: 'Alexa.ColorController',
        name: 'SetColor'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ColorController',
              property: 'color',
              parameters: {},
              item: { name: 'color', type: 'Color' }
            },
            {
              name: 'ColorTemperatureController',
              property: 'colorTemperatureInKelvin',
              parameters: { requiresSetColorReset: true },
              item: { name: 'colorTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        color: {
          hue: 350.5,
          saturation: 0.7138,
          brightness: 0.6524
        }
      }
    },
    items: [
      { name: 'color', state: 'NULL', type: 'Color' },
      { name: 'color', state: '350.5,71.38,65.24', type: 'Color' },
      { name: 'colorTemperature', state: 'NULL', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ColorController',
              name: 'color',
              value: {
                hue: 350.5,
                saturation: 0.7138,
                brightness: 0.6524
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
        commands: [{ name: 'color', value: '350.5,71.38,65.24' }],
        updates: [{ name: 'colorTemperature', value: 0 }]
      }
    }
  }
];
