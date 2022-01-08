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
    description: 'set brightness dimmer item',
    directive: {
      header: {
        namespace: 'Alexa.BrightnessController',
        name: 'SetBrightness'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'BrightnessController',
              property: 'brightness',
              parameters: {},
              item: { name: 'light1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        brightness: 42
      }
    },
    items: [{ name: 'light1', state: '42', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.BrightnessController',
              name: 'brightness',
              value: 42
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
        commands: [{ name: 'light1', value: 42 }]
      }
    }
  },
  {
    description: 'set brightness color item',
    directive: {
      header: {
        namespace: 'Alexa.BrightnessController',
        name: 'SetBrightness'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'BrightnessController',
              property: 'brightness',
              parameters: {},
              item: { name: 'light1', type: 'Color' }
            }
          ])
        }
      },
      payload: {
        brightness: 42
      }
    },
    items: [{ name: 'light1', state: '0,0,42', type: 'Color' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.BrightnessController',
              name: 'brightness',
              value: 42
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
        commands: [{ name: 'light1', value: 42 }]
      }
    }
  },
  {
    description: 'adjust brightness dimmer item',
    directive: {
      header: {
        namespace: 'Alexa.BrightnessController',
        name: 'AdjustBrightness'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'BrightnessController',
              property: 'brightness',
              parameters: {},
              item: { name: 'light1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        brightnessDelta: 3
      }
    },
    items: [
      { name: 'light1', state: '42', type: 'Dimmer' },
      { name: 'light1', state: '45', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.BrightnessController',
              name: 'brightness',
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
        commands: [{ name: 'light1', value: 45 }]
      }
    }
  },
  {
    description: 'adjust brightness color item',
    directive: {
      header: {
        namespace: 'Alexa.BrightnessController',
        name: 'AdjustBrightness'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'BrightnessController',
              property: 'brightness',
              parameters: {},
              item: { name: 'light1', type: 'Color' }
            }
          ])
        }
      },
      payload: {
        brightnessDelta: 3
      }
    },
    items: [
      { name: 'light1', state: '0,0,42', type: 'Color' },
      { name: 'light1', state: '0,0,45', type: 'Color' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.BrightnessController',
              name: 'brightness',
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
        commands: [{ name: 'light1', value: 45 }]
      }
    }
  },
  {
    description: 'adjust brightness invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.BrightnessController',
        name: 'AdjustBrightness'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'BrightnessController',
              property: 'brightness',
              parameters: { retrievable: false },
              item: { name: 'light1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        brightnessDelta: 3
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
            message: 'Cannot retrieve state for item light1.'
          }
        }
      }
    }
  },
  {
    description: 'adjust brightness endpoint unreachable error',
    directive: {
      header: {
        namespace: 'Alexa.BrightnessController',
        name: 'AdjustBrightness'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'BrightnessController',
              property: 'brightness',
              parameters: {},
              item: { name: 'light1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        brightnessDelta: 3
      }
    },
    items: [{ name: 'light1', state: 'NULL', type: 'Dimmer' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Could not get numeric state for item light1.'
          }
        }
      }
    }
  }
];
