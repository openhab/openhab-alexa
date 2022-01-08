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
    description: 'set network access',
    directive: {
      header: {
        namespace: 'Alexa.Networking.AccessController',
        name: 'SetNetworkAccess'
      },
      endpoint: {
        endpointId: 'gComputer',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'NetworkingConnectedDevice',
              property: 'connectedDevice',
              parameters: {
                connectedTo: 'gRouter',
                deviceName: 'Computer',
                macAddress: '00:21:86:B5:6E:10'
              },
              item: { name: 'gComputer', type: 'Group' }
            },
            {
              name: 'NetworkingAccessController',
              property: 'networkAccess',
              parameters: {},
              item: { name: 'networkAccess', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        networkAccess: 'BLOCKED'
      }
    },
    items: [{ name: 'networkAccess', state: 'OFF', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Networking.AccessController',
              name: 'networkAccess',
              value: 'BLOCKED'
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
        commands: [{ name: 'networkAccess', value: 'OFF' }]
      }
    }
  },
  {
    description: 'set network access allowed inverted',
    directive: {
      header: {
        namespace: 'Alexa.Networking.AccessController',
        name: 'SetNetworkAccess'
      },
      endpoint: {
        endpointId: 'gComputer',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'NetworkingConnectedDevice',
              property: 'connectedDevice',
              parameters: {
                connectedTo: 'gRouter',
                deviceName: 'Computer',
                macAddress: '00:21:86:B5:6E:10'
              },
              item: { name: 'gComputer', type: 'Group' }
            },
            {
              name: 'NetworkingAccessController',
              property: 'networkAccess',
              parameters: {
                inverted: true
              },
              item: { name: 'networkAccess', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        networkAccess: 'ALLOWED'
      }
    },
    items: [{ name: 'networkAccess', state: 'OFF', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Networking.AccessController',
              name: 'networkAccess',
              value: 'ALLOWED'
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
        commands: [{ name: 'networkAccess', value: 'OFF' }]
      }
    }
  },
  {
    description: 'set network access blocked inverted',
    directive: {
      header: {
        namespace: 'Alexa.Networking.AccessController',
        name: 'SetNetworkAccess'
      },
      endpoint: {
        endpointId: 'gComputer',
        cookie: {
          capabilities: JSON.stringify([
            {
              name: 'NetworkingConnectedDevice',
              property: 'connectedDevice',
              parameters: {
                connectedTo: 'gRouter',
                deviceName: 'Computer',
                macAddress: '00:21:86:B5:6E:10'
              },
              item: { name: 'gComputer', type: 'Group' }
            },
            {
              name: 'NetworkingAccessController',
              property: 'networkAccess',
              parameters: {
                inverted: true
              },
              item: { name: 'networkAccess', type: 'Switch' }
            }
          ])
        }
      },
      payload: {
        networkAccess: 'BLOCKED'
      }
    },
    items: [{ name: 'networkAccess', state: 'ON', type: 'Switch' }],
    expected: {
      alexa: {
        context: {
          properties: [
            {
              namespace: 'Alexa.Networking.AccessController',
              name: 'networkAccess',
              value: 'BLOCKED'
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
        commands: [{ name: 'networkAccess', value: 'ON' }]
      }
    }
  }
];
