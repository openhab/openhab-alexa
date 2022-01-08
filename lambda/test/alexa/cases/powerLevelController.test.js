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
    description: 'set power level',
    directive: {
      header: {
        namespace: 'Alexa.PowerLevelController',
        name: 'SetPowerLevel'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerLevelController',
              property: 'powerLevel',
              parameters: {},
              item: { name: 'device1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        powerLevel: 42
      }
    },
    items: [{ name: 'device1', state: '42', type: 'Dimmer' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.PowerLevelController',
              name: 'powerLevel',
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
    description: 'adjust power level',
    directive: {
      header: {
        namespace: 'Alexa.PowerLevelController',
        name: 'AdjustPowerLevel'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerLevelController',
              property: 'powerLevel',
              parameters: {},
              item: { name: 'device1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        powerLevelDelta: 3
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
              namespace: 'Alexa.PowerLevelController',
              name: 'powerLevel',
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
    description: 'adjust power level invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.PowerLevelController',
        name: 'AdjustPowerLevel'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerLevelController',
              property: 'powerLevel',
              parameters: { retrievable: false },
              item: { name: 'device1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        powerLevelDelta: 3
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
    description: 'adjust power level endpoint unreachable error',
    directive: {
      header: {
        namespace: 'Alexa.PowerLevelController',
        name: 'AdjustPowerLevel'
      },
      endpoint: {
        endpointId: 'device1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'PowerLevelController',
              property: 'powerLevel',
              parameters: {},
              item: { name: 'device1', type: 'Dimmer' }
            }
          ])
        }
      },
      payload: {
        powerLevelDelta: 3
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
