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
    description: 'set thermostat mode string state map parameters',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetThermostatMode'
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
        thermostatMode: {
          value: 'COOL'
        }
      }
    },
    items: [{ name: 'thermostatMode', state: '2', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'COOL'
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
        commands: [{ name: 'thermostatMode', value: '2' }]
      }
    }
  },
  {
    description: 'set thermostat mode numeric state map parameters',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetThermostatMode'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: 0, HEAT: 1, COOL: 2, AUTO: 3 },
              item: { name: 'thermostatMode', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        thermostatMode: {
          value: 'OFF'
        }
      }
    },
    items: [{ name: 'thermostatMode', state: '0', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
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
        commands: [{ name: 'thermostatMode', value: 0 }]
      }
    }
  },
  {
    description: 'set thermostat mode binding parameter',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetThermostatMode'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { binding: 'nest' },
              item: { name: 'thermostatMode', type: 'String' }
            }
          ])
        }
      },
      payload: {
        thermostatMode: {
          value: 'AUTO'
        }
      }
    },
    items: [{ name: 'thermostatMode', state: 'HEAT_COOL', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'AUTO'
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
        commands: [{ name: 'thermostatMode', value: 'HEAT_COOL' }]
      }
    }
  },
  {
    description: 'set thermostat mode invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetThermostatMode'
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
        thermostatMode: {
          value: 'COOL'
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
            message: 'The thermostat has no mode property.'
          }
        }
      }
    }
  },
  {
    description: 'set thermostat mode unsupported mode error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'SetThermostatMode'
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
        thermostatMode: {
          value: 'ECO'
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
            type: 'UNSUPPORTED_THERMOSTAT_MODE',
            message: "The thermostat doesn't support ECO mode."
          }
        }
      }
    }
  },
  {
    description: 'resume thermostat schedule number item',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'ResumeSchedule'
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
              parameters: {},
              item: { name: 'thermostatHold', type: 'Number' }
            }
          ])
        }
      },
      payload: {}
    },
    items: [
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'thermostatMode', state: '1', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'HEAT'
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
        commands: [{ name: 'thermostatHold', value: 0 }]
      }
    }
  },
  {
    description: 'resume thermostat schedule string item',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'ResumeSchedule'
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
              parameters: {},
              item: { name: 'thermostatHold', type: 'String' }
            }
          ])
        }
      },
      payload: {}
    },
    items: [
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'thermostatMode', state: '1', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'HEAT'
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
        commands: [{ name: 'thermostatHold', value: 'schedule' }]
      }
    }
  },
  {
    description: 'resume thermostat schedule switch item',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'ResumeSchedule'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'TemperatureSensor',
              property: 'temperature',
              parameters: { scale: 'FAHRENHEIT' },
              item: { name: 'temperature', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3' },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'thermostatHold',
              parameters: { inverted: true },
              item: { name: 'thermostatHold', type: 'Switch' }
            }
          ])
        }
      },
      payload: {}
    },
    items: [
      { name: 'thermostatMode', state: '1', type: 'Number' },
      { name: 'temperature', state: '70', type: 'Number' },
      { name: 'thermostatMode', state: '1', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.TemperatureSensor',
              name: 'temperature',
              value: {
                value: 70.0,
                scale: 'FAHRENHEIT'
              }
            },
            {
              namespace: 'Alexa.ThermostatController',
              name: 'thermostatMode',
              value: 'HEAT'
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
        commands: [{ name: 'thermostatHold', value: 'ON' }]
      }
    }
  },
  {
    description: 'resume thermostat schedule mode not retrievable',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'ResumeSchedule'
      },
      endpoint: {
        endpointId: 'gThermostat',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ThermostatController',
              property: 'thermostatMode',
              parameters: { OFF: '0', HEAT: '1', COOL: '2', AUTO: '3', retrievable: false },
              item: { name: 'thermostatMode', type: 'Number' }
            },
            {
              name: 'ThermostatController',
              property: 'thermostatHold',
              parameters: {},
              item: { name: 'thermostatHold', type: 'Number' }
            }
          ])
        }
      },
      payload: {}
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
        commands: [{ name: 'thermostatHold', value: 0 }]
      }
    }
  },
  {
    description: 'resume thermostat schedule invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'ResumeSchedule'
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
      payload: {}
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
            message: 'The thermostat has no hold property.'
          }
        }
      }
    }
  },
  {
    description: 'resume thermostat schedule thermostat off error',
    directive: {
      header: {
        namespace: 'Alexa.ThermostatController',
        name: 'ResumeSchedule'
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
              parameters: {},
              item: { name: 'thermostatHold', type: 'Switch' }
            }
          ])
        }
      },
      payload: {}
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
  }
];
