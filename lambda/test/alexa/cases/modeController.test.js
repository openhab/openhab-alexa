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
    description: 'set mode',
    directive: {
      header: {
        namespace: 'Alexa.ModeController',
        instance: 'Mode:WashCycle',
        name: 'SetMode'
      },
      endpoint: {
        endpointId: 'gWasher',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ModeController',
              instance: 'Mode:WashCycle',
              property: 'mode',
              parameters: {
                capabilityNames: ['Wash Cycle', 'Wash Setting'],
                supportedModes: {
                  Normal: ['Normal', 'Cottons'],
                  Delicate: ['@Value.Delicate', 'Knites'],
                  Whites: ['Whites']
                }
              },
              item: { name: 'WashCycle', type: 'String' }
            }
          ])
        }
      },
      payload: {
        mode: 'Normal'
      }
    },
    items: [{ name: 'WashCycle', state: 'Normal', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ModeController',
              instance: 'Mode:WashCycle',
              name: 'mode',
              value: 'Normal'
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
        commands: [{ name: 'WashCycle', value: 'Normal' }]
      }
    }
  },
  {
    description: 'set mode open state no safety properties',
    directive: {
      header: {
        namespace: 'Alexa.ModeController',
        instance: 'OpenState',
        name: 'SetMode'
      },
      endpoint: {
        endpointId: 'GarageDoor',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ModeController',
              instance: 'OpenState',
              property: 'mode',
              parameters: {
                capabilityNames: ['@Setting.Opening'],
                supportedModes: { OPEN: ['@Value.Open'], CLOSED: ['@Value.Close'] },
                actionMappings: { Close: 'CLOSED', Open: 'OPEN', Lower: 'CLOSED', Raise: 'OPEN' },
                stateMappings: { Closed: 'CLOSED', Open: 'OPEN' },
                CLOSED: 'ON',
                OPEN: 'OFF'
              },
              item: { name: 'GarageDoor', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        mode: 'CLOSED'
      }
    },
    items: [{ name: 'GarageDoor', state: 'ON', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ModeController',
              instance: 'OpenState',
              name: 'mode',
              value: 'CLOSED'
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
        commands: [{ name: 'GarageDoor', value: 'ON' }]
      }
    }
  },
  {
    description: 'set mode open state obstacle detected error',
    directive: {
      header: {
        namespace: 'Alexa.ModeController',
        instance: 'OpenState',
        name: 'SetMode'
      },
      endpoint: {
        endpointId: 'GarageDoor',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ModeController',
              instance: 'OpenState',
              property: 'mode',
              parameters: {
                capabilityNames: ['@Setting.Opening'],
                supportedModes: { OPEN: ['@Value.Open'], CLOSED: ['@Value.Close'] },
                actionMappings: { Close: 'CLOSED', Open: 'OPEN', Lower: 'CLOSED', Raise: 'OPEN' },
                stateMappings: { Closed: 'CLOSED', Open: 'OPEN' },
                CLOSED: 'ON',
                OPEN: 'OFF'
              },
              item: { name: 'GarageDoor', type: 'Switch' }
            },
            {
              name: 'Safety',
              property: 'obstacleAlert',
              parameters: {},
              item: { name: 'ObstacleAlert', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        mode: 'CLOSED'
      }
    },
    items: [{ name: 'ObstacleAlert', state: 'ON', type: 'Switch' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa.Safety',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'OBSTACLE_DETECTED',
            message: 'Unable to close door because an obstacle is detected.'
          }
        }
      }
    }
  },
  {
    description: 'adjust mode',
    directive: {
      header: {
        namespace: 'Alexa.ModeController',
        instance: 'Mode:WashTemperature',
        name: 'AdjustMode'
      },
      endpoint: {
        endpointId: 'gWasher',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ModeController',
              instance: 'Mode:WashTemperature',
              property: 'mode',
              parameters: {
                capabilityNames: ['Wash Temperature', '@Setting.WaterTemperature'],
                supportedModes: {
                  0: ['Cold', 'Cool'],
                  1: ['Warm'],
                  2: ['Hot']
                },
                ordered: true
              },
              item: { name: 'WashTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        modeDelta: 1
      }
    },
    items: [
      { name: 'WashTemperature', state: '0', type: 'Number' },
      { name: 'WashTemperature', state: '1', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ModeController',
              instance: 'Mode:WashTemperature',
              name: 'mode',
              value: '1'
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
        commands: [{ name: 'WashTemperature', value: '1' }]
      }
    }
  },
  {
    description: 'adjust mode not retrievable invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ModeController',
        instance: 'Mode:WashTemperature',
        name: 'AdjustMode'
      },
      endpoint: {
        endpointId: 'gWasher',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ModeController',
              instance: 'Mode:WashTemperature',
              property: 'mode',
              parameters: {
                capabilityNames: ['Wash Temperature', '@Setting.WaterTemperature'],
                supportedModes: {
                  0: ['Cold', 'Cool'],
                  1: ['Warm'],
                  2: ['Hot']
                },
                ordered: true,
                retrievable: false
              },
              item: { name: 'WashTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        modeDelta: -1
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
            message: 'Cannot retrieve state for item WashTemperature.'
          }
        }
      }
    }
  },
  {
    description: 'adjust mode not supported invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.ModeController',
        instance: 'Mode:WashTemperature',
        name: 'AdjustMode'
      },
      endpoint: {
        endpointId: 'gWasher',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ModeController',
              instance: 'Mode:WashTemperature',
              property: 'mode',
              parameters: {
                capabilityNames: ['Wash Temperature', '@Setting.WaterTemperature'],
                supportedModes: {
                  0: ['Cold', 'Cool'],
                  1: ['Warm'],
                  2: ['Hot']
                },
                ordered: true
              },
              item: { name: 'WashTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        modeDelta: -1
      }
    },
    items: [{ name: 'WashTemperature', state: '3', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'INVALID_VALUE',
            message: 'Current mode 3 not found in supported list.'
          }
        }
      }
    }
  },
  {
    description: 'adjust mode out of range error',
    directive: {
      header: {
        namespace: 'Alexa.ModeController',
        instance: 'Mode:WashTemperature',
        name: 'AdjustMode'
      },
      endpoint: {
        endpointId: 'gWasher',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ModeController',
              instance: 'Mode:WashTemperature',
              property: 'mode',
              parameters: {
                capabilityNames: ['Wash Temperature', '@Setting.WaterTemperature'],
                supportedModes: {
                  0: ['Cold', 'Cool'],
                  1: ['Warm'],
                  2: ['Hot']
                },
                ordered: true
              },
              item: { name: 'WashTemperature', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        modeDelta: -1
      }
    },
    items: [{ name: 'WashTemperature', state: '0', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'VALUE_OUT_OF_RANGE',
            message: 'Adjusted mode value is out of range.'
          }
        }
      }
    }
  },
  {
    description: 'report mode range combo',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'WindowBlind',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ModeController',
              instance: 'Mode:WindowBlind',
              property: 'mode',
              parameters: {
                capabilityNames: ['@Setting.Opening'],
                supportedModes: {
                  UP: ['@Value.Up'],
                  DOWN: ['@Value.Down'],
                  STOP: ['@Value.Stop']
                },
                actionMappings: { Close: 'DOWN', Open: 'UP', Lower: 'DOWN', Raise: 'UP' }
              },
              item: { name: 'WindowBlind', type: 'Rollershutter' }
            },
            {
              name: 'RangeController',
              instance: 'Range:WindowBlind',
              property: 'rangeValue',
              parameters: {
                capabilityNames: ['@Setting.Opening'],
                supportedRange: [0, 100, 10],
                unitOfMeasure: 'Percent',
                stateMappings: { Closed: '100', Open: '0:99' }
              },
              item: { name: 'WindowBlind', type: 'Rollershutter' }
            }
          ])
        }
      }
    },
    items: [{ name: 'WindowBlind', state: '100', type: 'Rollershutter' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.RangeController',
              instance: 'Range:WindowBlind',
              name: 'rangeValue',
              value: 0
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
  },
  {
    description: 'report mode decouple state',
    directive: {
      header: {
        namespace: 'Alexa',
        name: 'ReportState'
      },
      endpoint: {
        endpointId: 'GarageDoor',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'ModeController',
              instance: 'OpenState',
              property: 'mode',
              parameters: {
                capabilityNames: ['@Setting.Opening'],
                supportedModes: { OPEN: ['@Value.Open'], CLOSED: ['@Value.Close'] },
                actionMappings: { Close: 'CLOSED', Open: 'OPEN', Lower: 'CLOSED', Raise: 'OPEN' },
                stateMappings: { Closed: 'CLOSED', Open: 'OPEN' },
                CLOSED: 'OFF',
                OPEN: 'ON'
              },
              item: { name: 'TargetGarageDoor', type: 'Switch' }
            },
            {
              name: 'ModeController',
              instance: 'OpenState',
              property: 'mode',
              tag: 'sensor',
              parameters: {
                capabilityNames: ['@Setting.Opening'],
                supportedModes: { OPEN: ['@Value.Open'], CLOSED: ['@Value.Close'] },
                CLOSED: 'CLOSED',
                OPEN: 'OPEN'
              },
              item: { name: 'CurrentGarageDoor', type: 'Contact' }
            }
          ])
        }
      }
    },
    items: [{ name: 'CurrentGarageDoor', state: 'OPEN', type: 'Contact' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.ModeController',
              instance: 'OpenState',
              name: 'mode',
              value: 'OPEN'
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
