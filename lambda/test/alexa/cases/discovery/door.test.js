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
  description: 'door',
  items: [
    {
      type: 'Switch',
      name: 'garageDoor1',
      label: 'Garage Door 1',
      metadata: {
        alexa: {
          value: 'GarageDoor',
          config: {
            inverted: 1 // should be converted to true boolean
          }
        }
      }
    },
    {
      type: 'Group',
      name: 'gGarageDoor2',
      label: 'Garage Door 2',
      metadata: {
        alexa: {
          value: 'GarageDoor'
        }
      }
    },
    {
      type: 'Switch',
      name: 'targetGarageDoor2',
      groupNames: ['gGarageDoor2'],
      metadata: {
        alexa: {
          value: 'TargetOpenState'
        }
      }
    },
    {
      type: 'Contact',
      name: 'currentGarageDoor2',
      groupNames: ['gGarageDoor2'],
      metadata: {
        alexa: {
          value: 'CurrentOpenState'
        }
      }
    },
    {
      type: 'Switch',
      name: 'obstacleGarageDoor2',
      groupNames: ['gGarageDoor2'],
      metadata: {
        alexa: {
          value: 'ObstacleAlert'
        }
      }
    },
    {
      type: 'Group',
      name: 'gGarageDoor3',
      label: 'Garage Door 3',
      metadata: {
        alexa: {
          value: 'GarageDoor'
        }
      }
    },
    {
      type: 'Switch',
      name: 'targetGarageDoor3',
      groupNames: ['gGarageDoor3'],
      metadata: {
        alexa: {
          value: 'TargetOpenState'
        }
      }
    },
    {
      type: 'Contact',
      name: 'currentGarageDoor3',
      groupNames: ['gGarageDoor3'],
      metadata: {
        alexa: {
          value: 'CurrentOpenState',
          config: {
            inverted: true
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'door1',
      label: 'Door 1',
      metadata: {
        alexa: {
          value: 'ToggleController.toggleState',
          config: {
            category: 'DOOR',
            friendlyNames: ['@Setting.Opening'],
            actionMappings: ['Close=OFF', 'Open=ON'],
            stateMappings: ['Closed=OFF', 'Open=ON']
          }
        }
      }
    },
    {
      type: 'Group',
      name: 'gDoor2',
      label: 'Door 2',
      metadata: {
        alexa: {
          value: 'Door'
        }
      }
    },
    {
      type: 'Switch',
      name: 'targetDoor2',
      groupNames: ['gDoor2'],
      metadata: {
        alexa: {
          value: 'TargetOpenState'
        }
      }
    },
    {
      type: 'Number',
      name: 'currentDoor2',
      groupNames: ['gDoor2'],
      metadata: {
        alexa: {
          value: 'CurrentOpenState'
        }
      }
    },
    {
      type: 'Number', // unsupported target item type
      name: 'door99',
      label: 'Invalid Door',
      metadata: {
        alexa: {
          value: 'Door'
        }
      }
    }
  ],
  catalog: {
    '@Setting.Position': [
      {
        text: 'Position',
        locale: 'en-US'
      }
    ]
  },
  expected: {
    garageDoor1: {
      capabilities: ['Alexa.ModeController:OpenState.mode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['GARAGE_DOOR'],
      friendlyName: 'Garage Door 1',
      propertyFlags: {
        'Alexa.ModeController:OpenState': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:OpenState': {
          friendlyNames: ['asset:Alexa.Setting.Opening']
        }
      },
      configuration: {
        'Alexa.ModeController:OpenState': {
          ordered: false,
          supportedModes: {
            OPEN: {
              friendlyNames: ['asset:Alexa.Value.Open']
            },
            CLOSED: {
              friendlyNames: ['asset:Alexa.Value.Close']
            }
          }
        }
      },
      semantics: {
        'Alexa.ModeController:OpenState': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close', 'Alexa.Actions.Lower'],
              directive: { name: 'SetMode', payload: { mode: 'CLOSED' } }
            },
            {
              actions: ['Alexa.Actions.Open', 'Alexa.Actions.Raise'],
              directive: { name: 'SetMode', payload: { mode: 'OPEN' } }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 'CLOSED'
            },
            {
              states: ['Alexa.States.Open'],
              value: 'OPEN'
            }
          ]
        }
      },
      cookie: [
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
          item: { name: 'garageDoor1', type: 'Switch' }
        }
      ]
    },
    gGarageDoor2: {
      capabilities: ['Alexa.ModeController:OpenState.mode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['GARAGE_DOOR'],
      friendlyName: 'Garage Door 2',
      propertyFlags: {
        'Alexa.ModeController:OpenState': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:OpenState': {
          friendlyNames: ['asset:Alexa.Setting.Opening']
        }
      },
      configuration: {
        'Alexa.ModeController:OpenState': {
          ordered: false,
          supportedModes: {
            OPEN: {
              friendlyNames: ['asset:Alexa.Value.Open']
            },
            CLOSED: {
              friendlyNames: ['asset:Alexa.Value.Close']
            }
          }
        }
      },
      semantics: {
        'Alexa.ModeController:OpenState': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close', 'Alexa.Actions.Lower'],
              directive: { name: 'SetMode', payload: { mode: 'CLOSED' } }
            },
            {
              actions: ['Alexa.Actions.Open', 'Alexa.Actions.Raise'],
              directive: { name: 'SetMode', payload: { mode: 'OPEN' } }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 'CLOSED'
            },
            {
              states: ['Alexa.States.Open'],
              value: 'OPEN'
            }
          ]
        }
      },
      cookie: [
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
          item: { name: 'targetGarageDoor2', type: 'Switch' }
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
          item: { name: 'currentGarageDoor2', type: 'Contact' }
        },
        {
          name: 'Safety',
          property: 'obstacleAlert',
          parameters: {},
          item: { name: 'obstacleGarageDoor2', type: 'Switch' }
        }
      ]
    },
    gGarageDoor3: {
      capabilities: ['Alexa.ModeController:OpenState.mode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['GARAGE_DOOR'],
      friendlyName: 'Garage Door 3',
      propertyFlags: {
        'Alexa.ModeController:OpenState': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:OpenState': {
          friendlyNames: ['asset:Alexa.Setting.Opening']
        }
      },
      configuration: {
        'Alexa.ModeController:OpenState': {
          ordered: false,
          supportedModes: {
            OPEN: {
              friendlyNames: ['asset:Alexa.Value.Open']
            },
            CLOSED: {
              friendlyNames: ['asset:Alexa.Value.Close']
            }
          }
        }
      },
      semantics: {
        'Alexa.ModeController:OpenState': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close', 'Alexa.Actions.Lower'],
              directive: { name: 'SetMode', payload: { mode: 'CLOSED' } }
            },
            {
              actions: ['Alexa.Actions.Open', 'Alexa.Actions.Raise'],
              directive: { name: 'SetMode', payload: { mode: 'OPEN' } }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 'CLOSED'
            },
            {
              states: ['Alexa.States.Open'],
              value: 'OPEN'
            }
          ]
        }
      },
      cookie: [
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
          item: { name: 'targetGarageDoor3', type: 'Switch' }
        },
        {
          name: 'ModeController',
          instance: 'OpenState',
          property: 'mode',
          tag: 'sensor',
          parameters: {
            capabilityNames: ['@Setting.Opening'],
            supportedModes: { OPEN: ['@Value.Open'], CLOSED: ['@Value.Close'] },
            OPEN: 'CLOSED',
            CLOSED: 'OPEN'
          },
          item: { name: 'currentGarageDoor3', type: 'Contact' }
        }
      ]
    },
    door1: {
      capabilities: ['Alexa.ToggleController:door1.toggleState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['DOOR'],
      friendlyName: 'Door 1',
      propertyFlags: {
        'Alexa.ToggleController:door1': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ToggleController:door1': {
          friendlyNames: ['asset:Alexa.Setting.Opening']
        }
      },
      semantics: {
        'Alexa.ToggleController:door1': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close'],
              directive: { name: 'TurnOff', payload: {} }
            },
            {
              actions: ['Alexa.Actions.Open'],
              directive: { name: 'TurnOn', payload: {} }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 'OFF'
            },
            {
              states: ['Alexa.States.Open'],
              value: 'ON'
            }
          ]
        }
      },
      cookie: [
        {
          name: 'ToggleController',
          instance: 'Toggle:door1',
          property: 'toggleState',
          parameters: {
            capabilityNames: ['@Setting.Opening'],
            actionMappings: { Close: 'OFF', Open: 'ON' },
            stateMappings: { Closed: 'OFF', Open: 'ON' }
          },
          item: { name: 'door1', type: 'Switch' }
        }
      ]
    },
    gDoor2: {
      capabilities: ['Alexa.ModeController:OpenState.mode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['DOOR'],
      friendlyName: 'Door 2',
      propertyFlags: {
        'Alexa.ModeController:OpenState': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:OpenState': {
          friendlyNames: ['asset:Alexa.Setting.Opening']
        }
      },
      configuration: {
        'Alexa.ModeController:OpenState': {
          ordered: false,
          supportedModes: {
            OPEN: {
              friendlyNames: ['asset:Alexa.Value.Open']
            },
            CLOSED: {
              friendlyNames: ['asset:Alexa.Value.Close']
            }
          }
        }
      },
      semantics: {
        'Alexa.ModeController:OpenState': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close', 'Alexa.Actions.Lower'],
              directive: { name: 'SetMode', payload: { mode: 'CLOSED' } }
            },
            {
              actions: ['Alexa.Actions.Open', 'Alexa.Actions.Raise'],
              directive: { name: 'SetMode', payload: { mode: 'OPEN' } }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 'CLOSED'
            },
            {
              states: ['Alexa.States.Open'],
              value: 'OPEN'
            }
          ]
        }
      },
      cookie: [
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
          item: { name: 'targetDoor2', type: 'Switch' }
        },
        {
          name: 'ModeController',
          instance: 'OpenState',
          property: 'mode',
          tag: 'sensor',
          parameters: {
            capabilityNames: ['@Setting.Opening'],
            supportedModes: { OPEN: ['@Value.Open'], CLOSED: ['@Value.Close'] },
            CLOSED: 0,
            OPEN: 1
          },
          item: { name: 'currentDoor2', type: 'Number' }
        }
      ]
    }
  }
};
