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
    description: 'set range value dimmer item',
    directive: {
      header: {
        namespace: 'Alexa.RangeController',
        instance: 'Range:BasementFan',
        name: 'SetRangeValue'
      },
      endpoint: {
        endpointId: 'BasementFan',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'RangeController',
              instance: 'Range:BasementFan',
              property: 'rangeValue',
              parameters: {
                capabilityNames: ['@Setting.FanSpeed'],
                supportedRange: [0, 100, 1]
              },
              item: { name: 'BasementFan', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        rangeValue: 50
      }
    },
    items: [{ name: 'BasementFan', state: '50', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.RangeController',
              instance: 'Range:BasementFan',
              name: 'rangeValue',
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
        commands: [{ name: 'BasementFan', value: 50 }]
      }
    }
  },
  {
    description: 'set range value number item',
    directive: {
      header: {
        namespace: 'Alexa.RangeController',
        instance: 'Range:BasementFan',
        name: 'SetRangeValue'
      },
      endpoint: {
        endpointId: 'BasementFan',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'RangeController',
              instance: 'Range:BasementFan',
              property: 'rangeValue',
              parameters: {
                capabilityNames: ['@Setting.FanSpeed'],
                supportedRange: [1, 10, 1]
              },
              item: { name: 'BasementFan', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        rangeValue: 7
      }
    },
    items: [{ name: 'BasementFan', state: '7', type: 'Number' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.RangeController',
              instance: 'Range:BasementFan',
              name: 'rangeValue',
              value: 7
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
        commands: [{ name: 'BasementFan', value: 7 }]
      }
    }
  },
  {
    description: 'set range value rollershutter item',
    directive: {
      header: {
        namespace: 'Alexa.RangeController',
        instance: 'Range:WindowBlind',
        name: 'SetRangeValue'
      },
      endpoint: {
        endpointId: 'WindowBlind',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'RangeController',
              instance: 'Range:WindowBlind',
              property: 'rangeValue',
              parameters: {
                capabilityNames: ['@Setting.Opening'],
                supportedRange: [0, 100, 1]
              },
              item: { name: 'WindowBlind', type: 'Rollershutter' }
            }
          ])
        }
      },
      payload: {
        rangeValue: 40
      }
    },
    items: [{ name: 'WindowBlind', state: '60', type: 'Rollershutter' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.RangeController',
              instance: 'Range:WindowBlind',
              name: 'rangeValue',
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
        commands: [{ name: 'WindowBlind', value: 60 }]
      }
    }
  },
  {
    description: 'adjust range value',
    directive: {
      header: {
        namespace: 'Alexa.RangeController',
        instance: 'Range:BasementFan',
        name: 'AdjustRangeValue'
      },
      endpoint: {
        endpointId: 'BasementFan',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'RangeController',
              instance: 'Range:BasementFan',
              property: 'rangeValue',
              parameters: {
                capabilityNames: ['@Setting.FanSpeed'],
                supportedRange: [1, 10, 1]
              },
              item: { name: 'BasementFan', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        rangeValueDelta: -3,
        rangeValueDeltaDefault: false
      }
    },
    items: [
      { name: 'BasementFan', state: '7', type: 'Number' },
      { name: 'BasementFan', state: '4', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.RangeController',
              instance: 'Range:BasementFan',
              name: 'rangeValue',
              value: 4
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
        commands: [{ name: 'BasementFan', value: 4 }]
      }
    }
  },
  {
    description: 'adjust range value inverted',
    directive: {
      header: {
        namespace: 'Alexa.RangeController',
        instance: 'Range:BasementFan',
        name: 'AdjustRangeValue'
      },
      endpoint: {
        endpointId: 'BasementFan',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'RangeController',
              instance: 'Range:BasementFan',
              property: 'rangeValue',
              parameters: {
                capabilityNames: ['@Setting.FanSpeed'],
                supportedRange: [1, 10, 1],
                inverted: true
              },
              item: { name: 'BasementFan', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        rangeValueDelta: -3,
        rangeValueDeltaDefault: false
      }
    },
    items: [
      { name: 'BasementFan', state: '5', type: 'Number' },
      { name: 'BasementFan', state: '8', type: 'Number' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.RangeController',
              instance: 'Range:BasementFan',
              name: 'rangeValue',
              value: 2
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
        commands: [{ name: 'BasementFan', value: 8 }]
      }
    }
  },
  {
    description: 'adjust range value invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.RangeController',
        instance: 'Range:BasementFan',
        name: 'AdjustRangeValue'
      },
      endpoint: {
        endpointId: 'BasementFan',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'RangeController',
              instance: 'Range:BasementFan',
              property: 'rangeValue',
              parameters: {
                capabilityNames: ['@Setting.FanSpeed'],
                supportedRange: [1, 10, 1],
                retrievable: false
              },
              item: { name: 'BasementFan', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        rangeValueDelta: -3,
        rangeValueDeltaDefault: false
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
            message: 'Cannot retrieve state for item BasementFan.'
          }
        }
      }
    }
  },
  {
    description: 'adjust range value endpoint unreachable error',
    directive: {
      header: {
        namespace: 'Alexa.RangeController',
        instance: 'Range:BasementFan',
        name: 'AdjustRangeValue'
      },
      endpoint: {
        endpointId: 'BasementFan',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'RangeController',
              instance: 'Range:BasementFan',
              property: 'rangeValue',
              parameters: {
                capabilityNames: ['@Setting.FanSpeed'],
                supportedRange: [1, 10, 1]
              },
              item: { name: 'BasementFan', type: 'Number' }
            }
          ])
        }
      },
      payload: {
        rangeValueDelta: -3,
        rangeValueDeltaDefault: false
      }
    },
    items: [{ name: 'BasementFan', state: 'NULL', type: 'Number' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Could not get numeric state for item BasementFan.'
          }
        }
      }
    }
  }
];
