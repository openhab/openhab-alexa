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
  description: 'blind',
  items: [
    {
      type: 'Group',
      name: 'gWindowBlind1',
      label: 'Window Blind 1',
      metadata: {
        alexa: {
          value: 'Blind'
        }
      }
    },
    {
      type: 'Rollershutter',
      name: 'windowBlindPosition1',
      groupNames: ['gWindowBlind1'],
      metadata: {
        alexa: {
          value: 'PositionState'
        }
      }
    },
    {
      type: 'Rollershutter',
      name: 'windowBlindTilt1',
      groupNames: ['gWindowBlind1'],
      metadata: {
        alexa: {
          value: 'TiltAngle'
        }
      }
    },
    {
      type: 'Group',
      name: 'gWindowBlind2',
      label: 'Window Blind 2',
      metadata: {
        alexa: {
          value: 'Blind',
          config: {
            primaryControl: 'tilt'
          }
        }
      }
    },
    {
      type: 'Rollershutter',
      name: 'windowBlindPosition2',
      groupNames: ['gWindowBlind2'],
      metadata: {
        alexa: {
          value: 'PositionState'
        }
      }
    },
    {
      type: 'Rollershutter',
      name: 'windowBlindTilt2',
      groupNames: ['gWindowBlind2'],
      metadata: {
        alexa: {
          value: 'TiltAngle'
        }
      }
    },
    {
      type: 'Group',
      name: 'gWindowBlind3',
      label: 'Window Blind 3',
      metadata: {
        alexa: {
          value: 'Blind',
          config: {
            primaryControl: 'tilt'
          }
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'windowBlindPosition3',
      groupNames: ['gWindowBlind3'],
      metadata: {
        alexa: {
          value: 'PositionState'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'windowBlindTilt3',
      groupNames: ['gWindowBlind3'],
      metadata: {
        alexa: {
          value: 'TiltAngle'
        }
      }
    },
    {
      type: 'Group',
      name: 'gWindowBlind4',
      label: 'Window Blind 4',
      metadata: {
        alexa: {
          value: 'Blind',
          config: {
            primaryControl: 'tilt'
          }
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'windowBlindPosition4',
      groupNames: ['gWindowBlind4'],
      metadata: {
        alexa: {
          value: 'PositionState',
          config: {
            inverted: true
          }
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'windowBlindTilt4',
      groupNames: ['gWindowBlind4'],
      metadata: {
        alexa: {
          value: 'TiltAngle',
          config: {
            inverted: true
          }
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'windowBlindPosition5',
      label: 'Window Blind Position 5',
      metadata: {
        alexa: {
          value: 'Blind.PositionState'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'windowBlindPosition6',
      label: 'Window Blind Position 6',
      metadata: {
        alexa: {
          value: 'Blind.PositionState',
          config: {
            inverted: true
          }
        }
      }
    },
    {
      type: 'Rollershutter',
      name: 'windowBlindPosition7',
      label: 'Window Blind Position 7',
      metadata: {
        alexa: {
          value: 'Blind.PositionState',
          config: {
            inverted: false
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'windowBlindTilt5',
      label: 'Window Blind Tilt 5',
      metadata: {
        alexa: {
          value: 'Blind.TiltAngle'
        }
      }
    },
    {
      type: 'Number:Angle',
      name: 'windowBlindTilt6',
      label: 'Window Blind Tilt 6',
      metadata: {
        alexa: {
          value: 'Blind.TiltAngle',
          config: {
            inverted: 'yes' // should be converted to true boolean
          }
        }
      }
    },
    {
      type: 'Rollershutter',
      name: 'windowBlindTilt7',
      label: 'Window Blind Tilt 7',
      metadata: {
        alexa: {
          value: 'Blind.TiltAngle',
          config: {
            inverted: 'no' // should be converted to false boolean
          }
        }
      }
    }
  ],
  catalog: {
    '@Setting.Angle': [
      {
        text: 'Angle',
        locale: 'en-US'
      }
    ],
    '@Setting.Position': [
      {
        text: 'Position',
        locale: 'en-US'
      }
    ],
    '@Setting.Tilt': [
      {
        text: 'Tilt',
        locale: 'en-US'
      }
    ],
    '@Value.Up': [
      {
        text: 'Up',
        locale: 'en-US'
      }
    ],
    '@Value.Down': [
      {
        text: 'Down',
        locale: 'en-US'
      }
    ],
    '@Value.Stop': [
      {
        text: 'Stop',
        locale: 'en-US'
      }
    ]
  },
  expected: {
    gWindowBlind1: {
      capabilities: [
        'Alexa.ModeController:PositionCommand',
        'Alexa.RangeController:PositionState.rangeValue',
        'Alexa.PlaybackController',
        'Alexa.ModeController:TiltCommand',
        'Alexa.RangeController:TiltAngle.rangeValue',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['INTERIOR_BLIND'],
      friendlyName: 'Window Blind 1',
      propertyFlags: {
        'Alexa.RangeController:PositionState': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.RangeController:TiltAngle': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:PositionCommand': {
          friendlyNames: ['text:Position:en-US', 'asset:Alexa.Setting.Opening']
        },
        'Alexa.RangeController:PositionState': {
          friendlyNames: ['text:Position:en-US', 'asset:Alexa.Setting.Opening']
        },
        'Alexa.ModeController:TiltCommand': {
          friendlyNames: ['text:Tilt:en-US', 'text:Angle:en-US', 'asset:Alexa.Setting.Direction']
        },
        'Alexa.RangeController:TiltAngle': {
          friendlyNames: ['text:Tilt:en-US', 'text:Angle:en-US', 'asset:Alexa.Setting.Direction']
        }
      },
      configuration: {
        'Alexa.ModeController:PositionCommand': {
          ordered: false,
          supportedModes: {
            UP: {
              friendlyNames: ['text:Up:en-US']
            },
            DOWN: {
              friendlyNames: ['text:Down:en-US']
            },
            STOP: {
              friendlyNames: ['text:Stop:en-US']
            }
          }
        },
        'Alexa.RangeController:PositionState': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        },
        'Alexa.ModeController:TiltCommand': {
          ordered: false,
          supportedModes: {
            UP: {
              friendlyNames: ['text:Up:en-US']
            },
            DOWN: {
              friendlyNames: ['text:Down:en-US']
            },
            STOP: {
              friendlyNames: ['text:Stop:en-US']
            }
          }
        },
        'Alexa.RangeController:TiltAngle': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {
        'Alexa.ModeController:PositionCommand': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close', 'Alexa.Actions.Lower'],
              directive: { name: 'SetMode', payload: { mode: 'DOWN' } }
            },
            {
              actions: ['Alexa.Actions.Open', 'Alexa.Actions.Raise'],
              directive: { name: 'SetMode', payload: { mode: 'UP' } }
            }
          ]
        },
        'Alexa.RangeController:PositionState': {
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: 0, maximumValue: 99 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 100
            }
          ]
        },
        'Alexa.ModeController:TiltCommand': {},
        'Alexa.RangeController:TiltAngle': {}
      },
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Stop']
      },
      cookie: [
        {
          name: 'ModeController',
          instance: 'PositionCommand',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Position', '@Setting.Opening'],
            supportedModes: {
              UP: ['@Value.Up'],
              DOWN: ['@Value.Down'],
              STOP: ['@Value.Stop']
            },
            actionMappings: { Close: 'DOWN', Open: 'UP', Lower: 'DOWN', Raise: 'UP' }
          },
          item: { name: 'windowBlindPosition1', type: 'Rollershutter' }
        },
        {
          name: 'RangeController',
          instance: 'PositionState',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.Position', '@Setting.Opening'],
            supportedRange: [0, 100, 1],
            unitOfMeasure: 'Percent',
            stateMappings: { Closed: '100', Open: '0:99' }
          },
          item: { name: 'windowBlindPosition1', type: 'Rollershutter' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { STOP: 'STOP' },
          item: { name: 'windowBlindPosition1', type: 'Rollershutter' }
        },
        {
          name: 'ModeController',
          instance: 'TiltCommand',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Tilt', '@Setting.Angle', '@Setting.Direction'],
            supportedModes: {
              UP: ['@Value.Up'],
              DOWN: ['@Value.Down'],
              STOP: ['@Value.Stop']
            }
          },
          item: { name: 'windowBlindTilt1', type: 'Rollershutter' }
        },
        {
          name: 'RangeController',
          instance: 'TiltAngle',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.Tilt', '@Setting.Angle', '@Setting.Direction'],
            supportedRange: [0, 100, 1],
            unitOfMeasure: 'Percent'
          },
          item: { name: 'windowBlindTilt1', type: 'Rollershutter' }
        }
      ]
    },
    gWindowBlind2: {
      capabilities: [
        'Alexa.ModeController:PositionCommand',
        'Alexa.RangeController:PositionState.rangeValue',
        'Alexa.ModeController:TiltCommand',
        'Alexa.RangeController:TiltAngle.rangeValue',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['INTERIOR_BLIND'],
      friendlyName: 'Window Blind 2',
      propertyFlags: {
        'Alexa.RangeController:PositionState': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.RangeController:TiltAngle': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:PositionCommand': {
          friendlyNames: ['text:Position:en-US', 'asset:Alexa.Setting.Opening']
        },
        'Alexa.RangeController:PositionState': {
          friendlyNames: ['text:Position:en-US', 'asset:Alexa.Setting.Opening']
        },
        'Alexa.ModeController:TiltCommand': {
          friendlyNames: ['text:Tilt:en-US', 'text:Angle:en-US', 'asset:Alexa.Setting.Direction']
        },
        'Alexa.RangeController:TiltAngle': {
          friendlyNames: ['text:Tilt:en-US', 'text:Angle:en-US', 'asset:Alexa.Setting.Direction']
        }
      },
      configuration: {
        'Alexa.ModeController:PositionCommand': {
          ordered: false,
          supportedModes: {
            UP: {
              friendlyNames: ['text:Up:en-US']
            },
            DOWN: {
              friendlyNames: ['text:Down:en-US']
            },
            STOP: {
              friendlyNames: ['text:Stop:en-US']
            }
          }
        },
        'Alexa.RangeController:PositionState': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        },
        'Alexa.ModeController:TiltCommand': {
          ordered: false,
          supportedModes: {
            UP: {
              friendlyNames: ['text:Up:en-US']
            },
            DOWN: {
              friendlyNames: ['text:Down:en-US']
            },
            STOP: {
              friendlyNames: ['text:Stop:en-US']
            }
          }
        },
        'Alexa.RangeController:TiltAngle': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {
        'Alexa.ModeController:PositionCommand': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Lower'],
              directive: { name: 'SetMode', payload: { mode: 'DOWN' } }
            },
            {
              actions: ['Alexa.Actions.Raise'],
              directive: { name: 'SetMode', payload: { mode: 'UP' } }
            }
          ]
        },
        'Alexa.RangeController:PositionState': {},
        'Alexa.ModeController:TiltCommand': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close'],
              directive: { name: 'SetMode', payload: { mode: 'DOWN' } }
            },
            {
              actions: ['Alexa.Actions.Open'],
              directive: { name: 'SetMode', payload: { mode: 'UP' } }
            }
          ]
        },
        'Alexa.RangeController:TiltAngle': {
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: 0, maximumValue: 99 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 100
            }
          ]
        }
      },
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Stop']
      },
      cookie: [
        {
          name: 'ModeController',
          instance: 'PositionCommand',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Position', '@Setting.Opening'],
            supportedModes: {
              UP: ['@Value.Up'],
              DOWN: ['@Value.Down'],
              STOP: ['@Value.Stop']
            },
            actionMappings: { Lower: 'DOWN', Raise: 'UP' }
          },
          item: { name: 'windowBlindPosition2', type: 'Rollershutter' }
        },
        {
          name: 'RangeController',
          instance: 'PositionState',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.Position', '@Setting.Opening'],
            supportedRange: [0, 100, 1],
            unitOfMeasure: 'Percent'
          },
          item: { name: 'windowBlindPosition2', type: 'Rollershutter' }
        },
        {
          name: 'ModeController',
          instance: 'TiltCommand',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Tilt', '@Setting.Angle', '@Setting.Direction'],
            supportedModes: {
              UP: ['@Value.Up'],
              DOWN: ['@Value.Down'],
              STOP: ['@Value.Stop']
            },
            actionMappings: { Close: 'DOWN', Open: 'UP' }
          },
          item: { name: 'windowBlindTilt2', type: 'Rollershutter' }
        },
        {
          name: 'RangeController',
          instance: 'TiltAngle',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.Tilt', '@Setting.Angle', '@Setting.Direction'],
            supportedRange: [0, 100, 1],
            unitOfMeasure: 'Percent',
            stateMappings: { Closed: '100', Open: '0:99' }
          },
          item: { name: 'windowBlindTilt2', type: 'Rollershutter' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { STOP: 'STOP' },
          item: { name: 'windowBlindTilt2', type: 'Rollershutter' }
        }
      ]
    },
    gWindowBlind3: {
      capabilities: [
        'Alexa.RangeController:PositionState.rangeValue',
        'Alexa.RangeController:TiltAngle.rangeValue',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['INTERIOR_BLIND'],
      friendlyName: 'Window Blind 3',
      configuration: {
        'Alexa.RangeController:PositionState': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        },
        'Alexa.RangeController:TiltAngle': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {
        'Alexa.RangeController:PositionState': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Lower'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 0 } }
            },
            {
              actions: ['Alexa.Actions.Raise'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 100 } }
            }
          ]
        },
        'Alexa.RangeController:TiltAngle': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 0 } }
            },
            {
              actions: ['Alexa.Actions.Open'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 100 } }
            }
          ],
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: 1, maximumValue: 100 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 0
            }
          ]
        }
      }
    },
    gWindowBlind4: {
      capabilities: [
        'Alexa.RangeController:PositionState.rangeValue',
        'Alexa.RangeController:TiltAngle.rangeValue',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['INTERIOR_BLIND'],
      friendlyName: 'Window Blind 4',
      configuration: {
        'Alexa.RangeController:PositionState': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        },
        'Alexa.RangeController:TiltAngle': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {
        'Alexa.RangeController:PositionState': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Lower'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 100 } }
            },
            {
              actions: ['Alexa.Actions.Raise'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 0 } }
            }
          ]
        },
        'Alexa.RangeController:TiltAngle': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 100 } }
            },
            {
              actions: ['Alexa.Actions.Open'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 0 } }
            }
          ],
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: 0, maximumValue: 99 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 100
            }
          ]
        }
      }
    },
    windowBlindPosition5: {
      capabilities: ['Alexa.RangeController:PositionState.rangeValue', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['INTERIOR_BLIND'],
      friendlyName: 'Window Blind Position 5',
      configuration: {
        'Alexa.RangeController:PositionState': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {
        'Alexa.RangeController:PositionState': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close', 'Alexa.Actions.Lower'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 0 } }
            },
            {
              actions: ['Alexa.Actions.Open', 'Alexa.Actions.Raise'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 100 } }
            }
          ],
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: 1, maximumValue: 100 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 0
            }
          ]
        }
      }
    },
    windowBlindPosition6: {
      capabilities: ['Alexa.RangeController:PositionState.rangeValue', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['INTERIOR_BLIND'],
      friendlyName: 'Window Blind Position 6',
      configuration: {
        'Alexa.RangeController:PositionState': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {
        'Alexa.RangeController:PositionState': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close', 'Alexa.Actions.Lower'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 100 } }
            },
            {
              actions: ['Alexa.Actions.Open', 'Alexa.Actions.Raise'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 0 } }
            }
          ],
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: 0, maximumValue: 99 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 100
            }
          ]
        }
      }
    },
    windowBlindPosition7: {
      capabilities: [
        'Alexa.ModeController:PositionCommand',
        'Alexa.RangeController:PositionState.rangeValue',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['INTERIOR_BLIND'],
      friendlyName: 'Window Blind Position 7',
      semantics: {
        'Alexa.ModeController:PositionCommand': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close', 'Alexa.Actions.Lower'],
              directive: { name: 'SetMode', payload: { mode: 'DOWN' } }
            },
            {
              actions: ['Alexa.Actions.Open', 'Alexa.Actions.Raise'],
              directive: { name: 'SetMode', payload: { mode: 'UP' } }
            }
          ]
        },
        'Alexa.RangeController:PositionState': {
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: 1, maximumValue: 100 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 0
            }
          ]
        }
      }
    },
    windowBlindTilt5: {
      capabilities: ['Alexa.RangeController:TiltAngle.rangeValue', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['INTERIOR_BLIND'],
      friendlyName: 'Window Blind Tilt 5',
      configuration: {
        'Alexa.RangeController:TiltAngle': {
          supportedRange: { minimumValue: -90, maximumValue: 90, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Angle.Degrees'
        }
      },
      semantics: {
        'Alexa.RangeController:TiltAngle': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: -90 } }
            },
            {
              actions: ['Alexa.Actions.Open'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 0 } }
            }
          ],
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: -89, maximumValue: 89 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: -90
            }
          ]
        }
      }
    },
    windowBlindTilt6: {
      capabilities: ['Alexa.RangeController:TiltAngle.rangeValue', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['INTERIOR_BLIND'],
      friendlyName: 'Window Blind Tilt 6',
      configuration: {
        'Alexa.RangeController:TiltAngle': {
          supportedRange: { minimumValue: -90, maximumValue: 90, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Angle.Degrees'
        }
      },
      semantics: {
        'Alexa.RangeController:TiltAngle': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 90 } }
            },
            {
              actions: ['Alexa.Actions.Open'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 0 } }
            }
          ],
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: -89, maximumValue: 89 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 90
            }
          ]
        }
      }
    },
    windowBlindTilt7: {
      capabilities: [
        'Alexa.ModeController:TiltCommand',
        'Alexa.RangeController:TiltAngle.rangeValue',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['INTERIOR_BLIND'],
      friendlyName: 'Window Blind Tilt 7',
      semantics: {
        'Alexa.ModeController:TiltCommand': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close'],
              directive: { name: 'SetMode', payload: { mode: 'DOWN' } }
            },
            {
              actions: ['Alexa.Actions.Open'],
              directive: { name: 'SetMode', payload: { mode: 'UP' } }
            }
          ]
        },
        'Alexa.RangeController:TiltAngle': {
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: 1, maximumValue: 100 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 0
            }
          ]
        }
      }
    }
  }
};
