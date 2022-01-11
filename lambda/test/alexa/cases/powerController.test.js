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
    description: 'turn on power switch item',
    directive: {
      header: {
        namespace: 'Alexa.PowerController',
        name: 'TurnOn'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'light1', type: 'Switch' }
            }
          ])
        }
      }
    },
    items: [{ name: 'light1', state: 'ON', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
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
        commands: [{ name: 'light1', value: 'ON' }]
      }
    }
  },
  {
    description: 'turn on power dimmer item',
    directive: {
      header: {
        namespace: 'Alexa.PowerController',
        name: 'TurnOn'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'light1', type: 'Dimmer' }
            }
          ])
        }
      }
    },
    items: [{ name: 'light1', state: '100', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
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
        commands: [{ name: 'light1', value: 'ON' }]
      }
    }
  },
  {
    description: 'turn on power number item',
    directive: {
      header: {
        namespace: 'Alexa.PowerController',
        name: 'TurnOn'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: { OFF: '0', ON: '10' },
              item: { name: 'device1', type: 'Number' }
            }
          ])
        }
      }
    },
    items: [{ name: 'device1', state: '10', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
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
        commands: [{ name: 'device1', value: '10' }]
      }
    }
  },
  {
    description: 'turn on power not retrievable state',
    directive: {
      header: {
        namespace: 'Alexa.PowerController',
        name: 'TurnOn'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: { retrievable: false },
              item: { name: 'light1', type: 'Switch' }
            }
          ])
        }
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
        commands: [{ name: 'light1', value: 'ON' }]
      }
    }
  },
  {
    description: 'turn off power color item',
    directive: {
      header: {
        namespace: 'Alexa.PowerController',
        name: 'TurnOff'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'light1', type: 'Color' }
            }
          ])
        }
      }
    },
    items: [{ name: 'light1', state: '0,0,0', type: 'Color' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
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
        commands: [{ name: 'light1', value: 'OFF' }]
      }
    }
  },
  {
    description: 'turn off power string item',
    directive: {
      header: {
        namespace: 'Alexa.PowerController',
        name: 'TurnOff'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: { OFF: 'off', ON: 'on' },
              item: { name: 'device1', type: 'String' }
            }
          ])
        }
      }
    },
    items: [{ name: 'device1', state: 'off', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
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
        commands: [{ name: 'device1', value: 'off' }]
      }
    }
  },
  {
    description: 'turn off power invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.PowerController',
        name: 'TurnOff'
      },
      endpoint: {
        endpointId: 'light1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: {},
              item: { name: 'light1', type: 'Number' }
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
            message: 'No power state property defined.'
          }
        }
      }
    }
  },
  {
    description: 'report power state string item',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerController',
              property: 'powerState',
              parameters: { OFF: 'OFF', ON: 'LOW' },
              item: { name: 'device1', type: 'String' }
            }
          ])
        }
      }
    },
    items: [{ name: 'device1', state: 'HIGH', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerController',
              name: 'powerState',
              value: 'ON'
            }
          ]
        },
        event: {
          header: {
            namespace: 'Alexa',
            name: 'StateReport'
          }
        }
      }
    }
  }
];
