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
    description: 'set percentage',
    directive: {
      header: {
        namespace: 'Alexa.PercentageController',
        name: 'SetPercentage'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PercentageController',
              property: 'percentage',
              parameters: {},
              item: { name: 'device1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        percentage: 42
      }
    },
    items: [{ name: 'device1', state: '42', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PercentageController',
              name: 'percentage',
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
        commands: [{ name: 'device1', value: 42 }]
      }
    }
  },
  {
    description: 'set percentage inverted',
    directive: {
      header: {
        namespace: 'Alexa.PercentageController',
        name: 'SetPercentage'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PercentageController',
              property: 'percentage',
              parameters: {},
              item: { name: 'device1', type: 'Rollershutter' }
            }
          ])
        }
      },
      payload: {
        percentage: 42
      }
    },
    items: [{ name: 'device1', state: '58', type: 'Rollershutter' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PercentageController',
              name: 'percentage',
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
        commands: [{ name: 'device1', value: 58 }]
      }
    }
  },
  {
    description: 'adjust percentage',
    directive: {
      header: {
        namespace: 'Alexa.PercentageController',
        name: 'AdjustPercentage'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PercentageController',
              property: 'percentage',
              parameters: {},
              item: { name: 'device1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        percentageDelta: 3
      }
    },
    items: [
      { name: 'device1', state: '42', type: 'Dimmer' },
      { name: 'device1', state: '45', type: 'Dimmer' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PercentageController',
              name: 'percentage',
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
        commands: [{ name: 'device1', value: 45 }]
      }
    }
  },
  {
    description: 'adjust percentage inverted',
    directive: {
      header: {
        namespace: 'Alexa.PercentageController',
        name: 'AdjustPercentage'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PercentageController',
              property: 'percentage',
              parameters: {},
              item: { name: 'device1', type: 'Rollershutter' }
            }
          ])
        }
      },
      payload: {
        percentageDelta: 3
      }
    },
    items: [
      { name: 'device1', state: '42', type: 'Rollershutter' },
      { name: 'device1', state: '39', type: 'Rollershutter' }
    ],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PercentageController',
              name: 'percentage',
              value: 61
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
        commands: [{ name: 'device1', value: 39 }]
      }
    }
  },
  {
    description: 'adjust percentage invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.PercentageController',
        name: 'AdjustPercentage'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PercentageController',
              property: 'percentage',
              parameters: { retrievable: false },
              item: { name: 'device1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        percentageDelta: 3
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
            message: 'Cannot retrieve state for item device1.'
          }
        }
      }
    }
  },
  {
    description: 'adjust percentage endpoint unreachable error',
    directive: {
      header: {
        namespace: 'Alexa.PercentageController',
        name: 'AdjustPercentage'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PercentageController',
              property: 'percentage',
              parameters: {},
              item: { name: 'device1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        percentageDelta: 3
      }
    },
    items: [{ name: 'device1', state: 'NULL', type: 'Dimmer' }],
    expected: {
      alexa: {
        event: {
          header: {
            namespace: 'Alexa',
            name: 'ErrorResponse'
          },
          payload: {
            type: 'ENDPOINT_UNREACHABLE',
            message: 'Could not get numeric state for item device1.'
          }
        }
      }
    }
  }
];
