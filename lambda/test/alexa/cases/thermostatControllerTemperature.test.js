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
    description: 'set target temperature triple mode',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 73.0,
          scale: 'FAHRENHEIT'
        },
        upperSetpoint: {
          value: 78.0,
          scale: 'FAHRENHEIT'
        },
        lowerSetpoint: {
          value: 68.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'targetTemperature', state: '73', type: 'Number' },
      { name: 'highTargetTemperature', state: '78', type: 'Number' },
      { name: 'lowTargetTemperature', state: '68', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 73.0,
                scale: 'FAHRENHEIT'
              }
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'upperSetpoint',
              value: {
                value: 78.0,
                scale: 'FAHRENHEIT'
              }
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'lowerSetpoint',
              value: {
                value: 68.0,
                scale: 'FAHRENHEIT'
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
        commands: [
          { name: 'targetTemperature', value: 73 },
          { name: 'highTargetTemperature', value: 78 },
          { name: 'lowTargetTemperature', value: 68 }
        ]
      }
    }
  },
  {
    description: 'set target temperature dual mode in celsius',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'CELSIUS' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'CELSIUS' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 23.0,
          scale: 'CELSIUS'
        }
      }
    },
    items: [
      { name: 'highTargetTemperature', state: '24', type: 'Number' },
      { name: 'lowTargetTemperature', state: '22', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'upperSetpoint',
              value: {
                value: 24.0,
                scale: 'CELSIUS'
              }
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'lowerSetpoint',
              value: {
                value: 22.0,
                scale: 'CELSIUS'
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
        commands: [
          { name: 'highTargetTemperature', value: 24 },
          { name: 'lowTargetTemperature', value: 22 }
        ]
      }
    }
  },
  {
    description: 'set target temperature dual mode in fahrenheit',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 73.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'highTargetTemperature', state: '75', type: 'Number' },
      { name: 'lowTargetTemperature', state: '71', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'upperSetpoint',
              value: {
                value: 75.0,
                scale: 'FAHRENHEIT'
              }
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'lowerSetpoint',
              value: {
                value: 71.0,
                scale: 'FAHRENHEIT'
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
        commands: [
          { name: 'highTargetTemperature', value: 75 },
          { name: 'lowTargetTemperature', value: 71 }
        ]
      }
    }
  },
  {
    description: 'set target temperature dual mode with comfort range defined',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT', comfortRange: 5 },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT', comfortRange: 5 },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 73.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'highTargetTemperature', state: '78', type: 'Number' },
      { name: 'lowTargetTemperature', state: '68', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'upperSetpoint',
              value: {
                value: 78.0,
                scale: 'FAHRENHEIT'
              }
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'lowerSetpoint',
              value: {
                value: 68.0,
                scale: 'FAHRENHEIT'
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
        commands: [
          { name: 'highTargetTemperature', value: 78 },
          { name: 'lowTargetTemperature', value: 68 }
        ]
      }
    }
  },
  {
    description: 'set target temperature dual mode with eco setpoints',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3', ECO: '4' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              tag: 'eco',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'ecoHighTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              tag: 'eco',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'ecoLowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        upperSetpoint: {
          value: 82.0,
          scale: 'FAHRENHEIT'
        },
        lowerSetpoint: {
          value: 64.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'thermostatMode', state: '4', type: 'Number' },
      { name: 'thermostatMode', state: '4', type: 'Number' },
      { name: 'highTargetTemperature', state: '78', type: 'Number' },
      { name: 'lowTargetTemperature', state: '70', type: 'Number' },
      { name: 'ecoHighTargetTemperature', state: '82', type: 'Number' },
      { name: 'ecoLowTargetTemperature', state: '64', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'ECO'
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'upperSetpoint',
              value: {
                value: 82.0,
                scale: 'FAHRENHEIT'
              }
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'lowerSetpoint',
              value: {
                value: 64.0,
                scale: 'FAHRENHEIT'
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
        commands: [
          { name: 'ecoHighTargetTemperature', value: 82 },
          { name: 'ecoLowTargetTemperature', value: 64 }
        ]
      }
    }
  },
  {
    description: 'set target temperature dual mode in cooling mode',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 78.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'thermostatMode', state: '2', type: 'Number' },
      { name: 'thermostatMode', state: '2', type: 'Number' },
      { name: 'highTargetTemperature', state: '78', type: 'Number' },
      { name: 'lowTargetTemperature', state: '70', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'COOL'
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 78.0,
                scale: 'FAHRENHEIT'
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
        commands: [{ name: 'highTargetTemperature', value: 78 }]
      }
    }
  },
  {
    description: 'set target temperature dual mode in heating mode',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 70.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'highTargetTemperature', state: '78', type: 'Number' },
      { name: 'lowTargetTemperature', state: '70', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'HEAT'
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 70.0,
                scale: 'FAHRENHEIT'
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
        commands: [{ name: 'lowTargetTemperature', value: 70 }]
      }
    }
  },
  {
    description: 'set target temperature single mode with thermostat hold',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'thermostatHold',
              parameters: { inverted: true, requiresSetpointHold: true },
              item: { name: 'thermostatHold', type: 'Switch' }
            },
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 70.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'targetTemperature', state: '70', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'HEAT'
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 70,
                scale: 'FAHRENHEIT'
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
        commands: [
          { name: 'thermostatHold', value: 'OFF' },
          { name: 'targetTemperature', value: 70 }
        ]
      }
    }
  },
  {
    description: 'set target temperature single mode with conversion to celsius',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'CELSIUS' },
              item: { name: 'targetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'CELSIUS' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'CELSIUS' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 72.5,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'targetTemperature', state: '22.5', type: 'Number' },
      { name: 'highTargetTemperature', state: '25', type: 'Number' },
      { name: 'lowTargetTemperature', state: '20', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'HEAT'
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 22.5,
                scale: 'CELSIUS'
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
        commands: [{ name: 'targetTemperature', value: 22.5 }]
      }
    }
  },
  {
    description: 'set target temperature single mode with conversion to fahrenheit',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 22.5,
          scale: 'CELSIUS'
        }
      }
    },
    items: [
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'targetTemperature', state: '72.5', type: 'Number' },
      { name: 'highTargetTemperature', state: '78', type: 'Number' },
      { name: 'lowTargetTemperature', state: '70', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'HEAT'
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 72.5,
                scale: 'FAHRENHEIT'
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
        commands: [{ name: 'targetTemperature', value: 72.5 }]
      }
    }
  },
  {
    description: 'set target temperature schedule error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 70,
          scale: 'FAHRENHEIT'
        },
        schedule: {
          start: '2017-06-22T21:35Z',
          duration: 'PT25M'
        }
      }
    },
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.ThermostatController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'UNWILLING_TO_SET_SCHEDULE',
            message: 'Thermostat schedule request not supported.'
          }
        }
      }
    }
  },
  {
    description: 'set target temperature out of range error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 35,
          scale: 'FAHRENHEIT'
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
            type: 'TEMPERATURE_VALUE_OUT_OF_RANGE',
            message: 'The target setpoint temperature cannot be set to 35°F.',
            validRange: {
              minimumValue: {
                value: 40,
                scale: 'FAHRENHEIT'
              },
              maximumValue: {
                value: 90,
                scale: 'FAHRENHEIT'
              }
            }
          }
        }
      }
    }
  },
  {
    description: 'set target temperature thermostat off error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 70,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [{ name: 'thermostatMode', state: '0', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.ThermostatController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'THERMOSTAT_IS_OFF',
            message: 'The thermostat is off.'
          }
        }
      }
    }
  },
  {
    description: 'set target temperature no capability invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          // workaround bug introduced by previous version
          propertyMap: JSON.stringify({
            ThermostatController: {}
          })
        }
      },
      payload: {
        targetSetpoint: {
          value: 70,
          scale: 'FAHRENHEIT'
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
            message: 'The thermostat has no capability defined.'
          }
        }
      }
    }
  },
  {
    description: 'set target temperature no setpoints invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 70,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [{ name: 'thermostatMode', state: '2', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_VALUE',
            message: 'The thermostat has no setpoint properties.'
          }
        }
      }
    }
  },
  {
    description: 'set target temperature dual setpoints unsupported error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        upperSetpoint: {
          value: 78.0,
          scale: 'FAHRENHEIT'
        },
        lowerSetpoint: {
          value: 68.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [{ name: 'thermostatMode', state: '2', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.ThermostatController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'DUAL_SETPOINTS_UNSUPPORTED',
            message: "The thermostat doesn't support dual setpoints in the current mode."
          }
        }
      }
    }
  },
  {
    description: 'set target temperature triple setpoints unsupported error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpoint: {
          value: 72.0,
          scale: 'FAHRENHEIT'
        },
        upperSetpoint: {
          value: 78.0,
          scale: 'FAHRENHEIT'
        },
        lowerSetpoint: {
          value: 68.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [{ name: 'thermostatMode', state: '3', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.ThermostatController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'TRIPLE_SETPOINTS_UNSUPPORTED',
            message: "The thermostat doesn't support triple setpoints in the current mode."
          }
        }
      }
    }
  },
  {
    description: 'set target temperature setpoints too close error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        upperSetpoint: {
          value: 72.0,
          scale: 'FAHRENHEIT'
        },
        lowerSetpoint: {
          value: 70.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.ThermostatController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'REQUESTED_SETPOINTS_TOO_CLOSE',
            message: 'The temperature setpoints are too close together.',
            minimumTemperatureDelta: {
              value: 4,
              scale: 'FAHRENHEIT'
            }
          }
        }
      }
    }
  },
  {
    description: 'adjust target temperature single mode',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: 2.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'targetTemperature', state: '73', type: 'Number' },
      { name: 'targetTemperature', state: '75', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 75.0,
                scale: 'FAHRENHEIT'
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
        commands: [{ name: 'targetTemperature', value: 75 }]
      }
    }
  },
  {
    description: 'adjust target temperature dual mode no thermostat mode',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: 2.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'highTargetTemperature', state: '75', type: 'Number' },
      { name: 'lowTargetTemperature', state: '71', type: 'Number' },
      { name: 'highTargetTemperature', state: '77', type: 'Number' },
      { name: 'lowTargetTemperature', state: '73', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'upperSetpoint',
              value: {
                value: 77.0,
                scale: 'FAHRENHEIT'
              }
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'lowerSetpoint',
              value: {
                value: 73.0,
                scale: 'FAHRENHEIT'
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
        commands: [
          { name: 'highTargetTemperature', value: 77 },
          { name: 'lowTargetTemperature', value: 73 }
        ]
      }
    }
  },
  {
    description: 'adjust target temperature dual mode in cooling mode',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'upperSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'highTargetTemperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'lowerSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'lowTargetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: 2.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'thermostatMode', state: '2', type: 'Number' },
      { name: 'highTargetTemperature', state: '76', type: 'Number' },
      { name: 'thermostatMode', state: '2', type: 'Number' },
      { name: 'highTargetTemperature', state: '78', type: 'Number' },
      { name: 'lowTargetTemperature', state: '70', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'COOL'
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 78.0,
                scale: 'FAHRENHEIT'
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
        commands: [{ name: 'highTargetTemperature', value: 78 }]
      }
    }
  },
  {
    description: 'adjust target temperature with thermostat hold',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'thermostatHold',
              parameters: { requiresSetpointHold: true },
              item: { name: 'thermostatHold', type: 'String' }
            },
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: 2.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'thermostatMode', state: '2', type: 'Number' },
      { name: 'targetTemperature', state: '76', type: 'Number' },
      { name: 'thermostatMode', state: '2', type: 'Number' },
      { name: 'targetTemperature', state: '78', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'COOL'
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 78.0,
                scale: 'FAHRENHEIT'
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
        commands: [
          { name: 'thermostatHold', value: 'hold' },
          { name: 'targetTemperature', value: 78 }
        ]
      }
    }
  },
  {
    description: 'adjust target temperature with conversion to celsius',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'CELSIUS' },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: 3.6,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'targetTemperature', state: '22', type: 'Number' },
      { name: 'targetTemperature', state: '24', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 24.0,
                scale: 'CELSIUS'
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
        commands: [{ name: 'targetTemperature', value: 24 }]
      }
    }
  },
  {
    description: 'adjust target temperature with conversion to fahrenheit',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: 2.0,
          scale: 'CELSIUS'
        }
      }
    },
    items: [
      { name: 'targetTemperature', state: '72', type: 'Number' },
      { name: 'targetTemperature', state: '75.6', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 75.6,
                scale: 'FAHRENHEIT'
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
        commands: [{ name: 'targetTemperature', value: 75.6 }]
      }
    }
  },
  {
    description: 'adjust target temperature with capping',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT', setpointRange: [60, 90] },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: -2.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [
      { name: 'targetTemperature', state: '60', type: 'Number' },
      { name: 'targetTemperature', state: '60', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'targetSetpoint',
              value: {
                value: 60,
                scale: 'FAHRENHEIT'
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
        commands: [{ name: 'targetTemperature', value: 60 }]
      }
    }
  },
  {
    description: 'adjust target temperature thermostat off error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: -2.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [{ name: 'thermostatMode', state: '0', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.ThermostatController',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'THERMOSTAT_IS_OFF',
            message: 'The thermostat is off.'
          }
        }
      }
    }
  },
  {
    description: 'adjust target temperature no capability invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          // workaround bug introduced by previous version
          propertyMap: JSON.stringify({
            ThermostatController: {}
          })
        }
      },
      payload: {
        targetSetpointDelta: {
          value: -2.0,
          scale: 'FAHRENHEIT'
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
            message: 'The thermostat has no capability defined.'
          }
        }
      }
    }
  },
  {
    description: 'adjust target temperature no setpoints invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: -2.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [{ name: 'thermostatMode', state: '2', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_VALUE',
            message: 'The thermostat has no setpoint properties.'
          }
        }
      }
    }
  },
  {
    description: 'adjust target temperature not retrievable invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT', retrievable: false },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: -2.0,
          scale: 'FAHRENHEIT'
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
            message: 'Cannot retrieve state for item targetTemperature.'
          }
        }
      }
    }
  },
  {
    description: 'adjust target temperature endpoint unreachable error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'AdjustTargetTemperature'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'targetSetpoint',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'targetTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        targetSetpointDelta: {
          value: -2.0,
          scale: 'FAHRENHEIT'
        }
      }
    },
    items: [{ name: 'targetSetpoint', state: 'NULL', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Could not get numeric state for item targetTemperature.'
          }
        }
      }
    }
  }
];
