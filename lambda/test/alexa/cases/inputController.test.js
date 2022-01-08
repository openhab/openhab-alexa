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
    description: 'select input',
    directive: {
      header: {
        namespace: 'Alexa.InputController',
        name: 'SelectInput'
      },
      endpoint: {
        endpointId: 'tvSource',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'InputController',
              property: 'input',
              parameters: { supportedInputs: ['HDMI 1', 'TV'] },
              item: { name: 'tvSource', type: 'String' }
            }
          ])
        }
      },
      payload: {
        input: 'HDMI 1'
      }
    },
    items: [{ name: 'tvSource', state: 'HDMI1', type: 'String' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.InputController',
              name: 'input',
              value: 'HDMI 1'
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
        commands: [{ name: 'tvSource', value: 'HDMI1' }]
      }
    }
  },
  {
    description: 'select input invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.InputController',
        name: 'SelectInput'
      },
      endpoint: {
        endpointId: 'tvSource',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'InputController',
              property: 'input',
              parameters: { supportedInputs: ['HDMI 1', 'TV'] },
              item: { name: 'tvSource', type: 'String' }
            }
          ])
        }
      },
      payload: {
        input: 'HDMI 2'
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
            message: "tvSource doesn't support input [HDMI 2]"
          }
        }
      }
    }
  }
];
