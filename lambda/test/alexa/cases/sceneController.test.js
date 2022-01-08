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
    description: 'activate scene',
    directive: {
      header: {
        namespace: 'Alexa.SceneController',
        name: 'Activate'
      },
      endpoint: {
        endpointId: 'scene1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SceneController',
              property: 'scene',
              parameters: {},
              item: { name: 'scene1', type: 'Switch' }
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
            namespace: 'Alexa.SceneController',
            name: 'ActivationStarted'
          },
          payload: {
            cause: {
              type: 'VOICE_INTERACTION'
            }
          }
        }
      },
      openhab: {
        commands: [{ name: 'scene1', value: 'ON' }]
      }
    }
  },
  {
    description: 'deactivate scene',
    directive: {
      header: {
        namespace: 'Alexa.SceneController',
        name: 'Deactivate'
      },
      endpoint: {
        endpointId: 'scene1',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'SceneController',
              property: 'scene',
              parameters: {},
              item: { name: 'scene1', type: 'Switch' }
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
            namespace: 'Alexa.SceneController',
            name: 'DeactivationStarted'
          },
          payload: {
            cause: {
              type: 'VOICE_INTERACTION'
            }
          }
        }
      },
      openhab: {
        commands: [{ name: 'scene1', value: 'OFF' }]
      }
    }
  }
];
