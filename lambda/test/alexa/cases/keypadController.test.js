/**
 * Copyright (c) 2010-2021 Contributors to the openHAB project
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
    description: 'send keystroke',
    directive: {
      header: {
        namespace: 'Alexa.KeypadController',
        name: 'SendKeystroke'
      },
      endpoint: {
        endpointId: 'tvNavigation',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'KeypadController',
              property: 'keystroke',
              parameters: { supportedKeys: ['UP', 'DOWN', 'LEFT', 'RIGHT', 'SELECT'] },
              item: { name: 'tvNavigation', type: 'String' }
            }
          ])
        }
      },
      payload: {
        keystroke: 'SELECT'
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
      openhab: [{ name: 'tvNavigation', value: 'select' }]
    }
  },
  {
    description: 'send keystroke invalid value error',
    directive: {
      header: {
        namespace: 'Alexa.KeypadController',
        name: 'SendKeystroke'
      },
      endpoint: {
        endpointId: 'tvNavigation',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'KeypadController',
              property: 'keystroke',
              parameters: { supportedKeys: ['UP', 'DOWN', 'LEFT', 'RIGHT', 'SELECT'] },
              item: { name: 'tvNavigation', type: 'String' }
            }
          ])
        }
      },
      payload: {
        keystroke: 'INFO'
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
            message: "tvNavigation doesn't support keystroke [INFO]"
          }
        }
      }
    }
  }
];
