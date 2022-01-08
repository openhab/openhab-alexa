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
    description: 'turn on toggle state switch item',
    directive: {
      header: {
        namespace: 'Alexa.ToggleController',
        instance: 'Toggle:FanOscillate',
        name: 'TurnOn'
      },
      endpoint: {
        endpointId: 'FanOscillate',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ToggleController',
              instance: 'Toggle:FanOscillate',
              property: 'toggleState',
              parameters: {
                capabilityNames: ['@Setting.Oscillate', 'Rotate']
              },
              item: { name: 'FanOscillate', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [{ name: 'FanOscillate', state: 'ON', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ToggleController',
              instance: 'Toggle:FanOscillate',
              name: 'toggleState',
              value: 'ON'
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
        commands: [{ name: 'FanOscillate', value: 'ON' }]
      }
    }
  },
  {
    description: 'turn on toggle state inverted switch item',
    directive: {
      header: {
        namespace: 'Alexa.ToggleController',
        instance: 'Toggle:FanOscillate',
        name: 'TurnOn'
      },
      endpoint: {
        endpointId: 'FanOscillate',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ToggleController',
              instance: 'Toggle:FanOscillate',
              property: 'toggleState',
              parameters: {
                capabilityNames: ['@Setting.Oscillate', 'Rotate'],
                inverted: true
              },
              item: { name: 'FanOscillate', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [{ name: 'FanOscillate', state: 'OFF', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ToggleController',
              instance: 'Toggle:FanOscillate',
              name: 'toggleState',
              value: 'ON'
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
        commands: [{ name: 'FanOscillate', value: 'OFF' }]
      }
    }
  },
  {
    description: 'turn on toggle state number item',
    directive: {
      header: {
        namespace: 'Alexa.ToggleController',
        instance: 'Toggle:FanLight',
        name: 'TurnOn'
      },
      endpoint: {
        endpointId: 'FanLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ToggleController',
              instance: 'Toggle:FanLight',
              property: 'toggleState',
              parameters: {
                capabilityNames: ['Light'],
                OFF: '0',
                ON: '2'
              },
              item: { name: 'FanLight', type: 'Number' }
            }
          ])
        }
      }
    },
    items: [{ name: 'FanLight', state: '2', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ToggleController',
              instance: 'Toggle:FanLight',
              name: 'toggleState',
              value: 'ON'
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
        commands: [{ name: 'FanLight', value: '2' }]
      }
    }
  },
  {
    description: 'turn off toggle state inverted switch item',
    directive: {
      header: {
        namespace: 'Alexa.ToggleController',
        instance: 'Toggle:FanOscillate',
        name: 'TurnOff'
      },
      endpoint: {
        endpointId: 'FanOscillate',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ToggleController',
              instance: 'Toggle:FanOscillate',
              property: 'toggleState',
              parameters: {
                capabilityNames: ['@Setting.Oscillate', 'Rotate'],
                inverted: true
              },
              item: { name: 'FanOscillate', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [{ name: 'FanOscillate', state: 'ON', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ToggleController',
              instance: 'Toggle:FanOscillate',
              name: 'toggleState',
              value: 'OFF'
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
        commands: [{ name: 'FanOscillate', value: 'ON' }]
      }
    }
  },
  {
    description: 'turn off toggle state number item',
    directive: {
      header: {
        namespace: 'Alexa.ToggleController',
        instance: 'Toggle:FanLight',
        name: 'TurnOff'
      },
      endpoint: {
        endpointId: 'FanLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ToggleController',
              instance: 'Toggle:FanLight',
              property: 'toggleState',
              parameters: {
                capabilityNames: ['Light'],
                OFF: '0',
                ON: '2'
              },
              item: { name: 'FanLight', type: 'Number' }
            }
          ])
        }
      }
    },
    items: [{ name: 'FanLight', state: '0', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ToggleController',
              instance: 'Toggle:FanLight',
              name: 'toggleState',
              value: 'OFF'
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
        commands: [{ name: 'FanLight', value: '0' }]
      }
    }
  },
  {
    description: 'turn off toggle state invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ToggleController',
        instance: 'Toggle:FanLight',
        name: 'TurnOff'
      },
      endpoint: {
        endpointId: 'FanLight',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ToggleController',
              instance: 'Toggle:FanLight',
              property: 'toggleState',
              parameters: {
                capabilityNames: ['Light']
              },
              item: { name: 'FanLight', type: 'String' }
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
            message: 'No toggle state property defined.'
          }
        }
      }
    }
  }
];
