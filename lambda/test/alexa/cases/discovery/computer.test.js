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

module.exports = {
  description: 'computer',
  items: [
    {
      type: 'Group',
      name: 'gComputer1',
      label: 'Computer',
      metadata: {
        alexa: {
          value: 'Computer',
          config: {
            hostname: 'workstation',
            macAddress: '00:21:86:B5:6E:10'
          }
        }
      },
      members: [
        {
          type: 'Switch',
          name: 'networkAccess',
          metadata: {
            alexa: {
              value: 'NetworkAccess'
            }
          }
        },
        {
          type: 'Switch',
          name: 'power',
          metadata: {
            alexa: {
              value: 'PowerState'
            }
          }
        }
      ],
      groups: [
        {
          type: 'Group',
          name: 'gRouter',
          label: 'Router',
          metadata: {
            alexa: {
              value: 'Router'
            }
          }
        }
      ]
    },
    {
      type: 'Group',
      name: 'gComputer99',
      label: 'Invalid Computer',
      metadata: {
        alexa: {
          value: 'Computer',
          config: {
            hostname: 'workstation',
            macAddress: '00:21:86:B5:6E:10'
          }
        }
      },
      members: [
        {
          type: 'Switch',
          name: 'networkAccess',
          metadata: {
            alexa: {
              value: 'NetworkAccess'
            }
          }
        }
      ],
      groups: [
        {
          type: 'Group',
          name: 'foobar'
        }
      ]
    }
  ],
  expected: {
    gComputer1: {
      capabilities: [
        'Alexa.Networking.ConnectedDevice',
        'Alexa.Networking.AccessController.networkAccess',
        'Alexa.PowerController.powerState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['COMPUTER'],
      friendlyName: 'Computer',
      configuration: {
        'Alexa.Networking.ConnectedDevice': {
          staticDeviceInformation: {
            deviceName: 'Computer',
            hostname: 'workstation',
            macAddress: '00:21:86:B5:6E:10'
          }
        },
        'Alexa.Networking.AccessController': {
          supportsScheduling: false
        }
      },
      relationships: {
        isConnectedBy: {
          endpointId: 'gRouter'
        }
      }
    }
  }
};
