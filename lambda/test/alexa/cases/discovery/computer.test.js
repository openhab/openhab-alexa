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

module.exports = {
  description: 'computer',
  items: [
    {
      type: 'Group',
      name: 'gComputer1',
      label: 'Computer',
      groupNames: ['gRouter1'],
      metadata: {
        alexa: {
          value: 'Computer',
          config: {
            hostname: 'workstation',
            macAddress: '00:21:86:B5:6E:10'
          }
        }
      }
    },
    {
      type: 'Group',
      name: 'gRouter1',
      label: 'Router',
      metadata: {
        alexa: {
          value: 'Router'
        }
      }
    },
    {
      type: 'Switch',
      name: 'networkAccess1',
      groupNames: ['gComputer1'],
      metadata: {
        alexa: {
          value: 'NetworkAccess'
        }
      }
    },
    {
      type: 'Switch',
      name: 'power',
      groupNames: ['gComputer1'],
      metadata: {
        alexa: {
          value: 'PowerState'
        }
      }
    },
    {
      type: 'Group',
      name: 'gComputer99',
      label: 'Invalid Computer',
      groupNames: ['gRouter99'],
      metadata: {
        alexa: {
          value: 'Computer',
          config: {
            hostname: 'workstation',
            macAddress: '00:21:86:B5:6E:10'
          }
        }
      }
    },
    {
      type: 'Group',
      name: 'gRouter99',
      label: 'Invalid Router',
      metadata: {
        alexa: {
          value: 'Invalid'
        }
      }
    },
    {
      type: 'Switch',
      name: 'networkAccess99',
      groupNames: ['gComputer99'],
      metadata: {
        alexa: {
          value: 'NetworkAccess'
        }
      }
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
          endpointId: 'gRouter1'
        }
      }
    },
    gRouter1: {
      capabilities: ['Alexa.Networking.HomeNetworkController', 'Alexa'],
      displayCategories: ['ROUTER'],
      friendlyName: 'Router'
    }
  }
};
