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
  description: 'other',
  items: [
    {
      type: 'String',
      name: 'mode1',
      label: 'Mode 1',
      metadata: {
        alexa: {
          value: 'Mode',
          config: {
            supportedModes: 'OFF=@Value.Off,LOW=@Value.Low,MEDIUM=@Value.Medium,HIGH=@Value.High',
            ordered: true,
            actionMappings: 'Close=OFF,Open=MEDIUM,Lower=(-1),Raise=(+1),TurnOff=OFF,TurnOn=MEDIUM,Stop=OFF'
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'mode2',
      label: 'Mode 2',
      metadata: {
        alexa: {
          value: 'Mode',
          config: {
            supportedModes: 'OFF=@Value.Close,ON=@Value.Open',
            actionMappings: 'Close=OFF,Open=ON,Stop=OFF'
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'mode3',
      label: 'Mode 3',
      metadata: {
        alexa: {
          value: 'Mode',
          config: {
            supportedModes: 'OFF=@Value.Close,ON=@Value.Open',
            ordered: false,
            // Invalid semantics
            actionMappings: 'Close=FOO,Open=BAR,Lower=(-1),Raise=(+1)',
            stateMappings: 'Closed=FOO,Open=BAR'
          }
        }
      }
    },
    {
      type: 'String',
      name: 'mode99',
      label: 'Mode Invalid',
      metadata: {
        alexa: {
          value: 'Mode' // Missing supported modes
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'range1',
      label: 'Range Value 1',
      metadata: {
        alexa: {
          value: 'RangeValue',
          config: {
            supportedCommands: 'INCREASE,DECREASE',
            actionMappings: 'Stop=OFF'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'range2',
      label: 'Range Value 2',
      metadata: {
        alexa: {
          value: 'RangeValue',
          config: {
            supportedRange: '0:10:1',
            // Invalid unit of measure
            unitOfMeasure: 'Invalid',
            // Invalid semantics (except playback action)
            actionMappings: 'Close=-1,Open=11,Lower=(-11),Raise=(+11),Stop=0',
            stateMappings: 'Closed=-1,Open=10:1'
          }
        }
      }
    },
    {
      type: 'Number:Dimensionless',
      name: 'range3',
      label: 'Range Value 3',
      stateDescription: {
        pattern: '%d %unit%' // Unit placeholder in state presentation
      },
      metadata: {
        alexa: {
          value: 'RangeValue',
          config: {
            // No playback action or turn on/off action support for number with dimension
            actionMappings: 'TurnOff=0,TurnOn=1,Stop=0'
          }
        }
      }
    },
    {
      type: 'Rollershutter',
      name: 'range4',
      label: 'Range Value 4',
      metadata: {
        alexa: {
          value: 'RangeValue',
          config: {
            supportedCommands: 'UP,DOWN,STOP',
            actionMappings: 'Stop=STOP'
          }
        }
      }
    },
    {
      type: 'Rollershutter',
      name: 'range5',
      label: 'Range Value 5',
      metadata: {
        alexa: {
          value: 'RangeValue',
          config: {
            // code coverage test for state mappings with same range
            stateMappings: 'Closed=1:100,Open=1:100'
          }
        }
      }
    },
    {
      type: 'Number:Angle',
      name: 'range6',
      label: 'Range Value 6',
      metadata: {
        alexa: {
          value: 'RangeValue',
          config: {
            nonControllable: true
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'range99',
      label: 'Range Value Invalid',
      metadata: {
        alexa: {
          value: 'RangeValue',
          config: {
            // Cannot be non-controllable & non-retrievable
            nonControllable: true,
            retrievable: false
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'toggle1',
      label: 'Toggle State 1',
      metadata: {
        alexa: {
          value: 'ToggleState',
          config: {
            // Invalid semantics
            actionMappings: 'Close=FOO,Open=BAR',
            stateMappings: 'Closed=FOO,Open=BAR'
          }
        }
      }
    },
    {
      type: 'String',
      name: 'toggle2',
      label: 'Toggle State 2',
      metadata: {
        alexa: {
          value: 'ToggleState',
          config: {
            OFF: 'off',
            ON: 'on',
            // code coverage test for state mappings with same value
            stateMappings: 'Closed=ON,Open=ON'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'toggle3',
      label: 'Toggle State 3',
      metadata: {
        alexa: {
          value: 'ToggleState',
          config: {
            OFF: '0',
            ON: '1',
            // No turn on/off action support for number
            actionMappings: 'TurnOff=0,TurnOn=1'
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'device99',
      label: 'Device Invalid',
      metadata: {
        alexa: {
          value: 'Other' // No default attributes for 'other' device type
        }
      }
    },
    {
      type: 'Group',
      name: 'group99',
      label: 'Group Invalid',
      metadata: {
        alexa: {
          value: 'Foobar' // Invalid endpoint group device type
        }
      }
    }
  ],
  catalog: {
    '@Setting.RangeValue': [
      {
        text: 'Range Value',
        locale: 'en-US'
      }
    ],
    '@Setting.ToggleState': [
      {
        text: 'Toggle State',
        locale: 'en-US'
      }
    ],
    '@Value.Decrease': [
      {
        text: 'Decrease',
        locale: 'en-US'
      }
    ],
    '@Value.Increase': [
      {
        text: 'Increase',
        locale: 'en-US'
      }
    ],
    '@Value.Off': [
      {
        text: 'Off',
        locale: 'en-US'
      }
    ],
    '@Value.Stop': [
      {
        text: 'Stop',
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
    ]
  },
  expected: {
    mode1: {
      capabilities: [
        'Alexa.ModeController:mode1.mode',
        'Alexa.PowerController.powerState',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['OTHER', 'SWITCH'],
      friendlyName: 'Mode 1',
      propertyFlags: {
        'Alexa.ModeController:mode1': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:mode1': {
          friendlyNames: ['asset:Alexa.Setting.Mode']
        }
      },
      configuration: {
        'Alexa.ModeController:mode1': {
          ordered: true,
          supportedModes: {
            OFF: { friendlyNames: ['text:Off:en-US'] },
            LOW: { friendlyNames: ['asset:Alexa.Value.Low'] },
            MEDIUM: { friendlyNames: ['asset:Alexa.Value.Medium'] },
            HIGH: { friendlyNames: ['asset:Alexa.Value.High'] }
          }
        }
      },
      semantics: {
        'Alexa.ModeController:mode1': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close'],
              directive: { name: 'SetMode', payload: { mode: 'OFF' } }
            },
            {
              actions: ['Alexa.Actions.Open'],
              directive: { name: 'SetMode', payload: { mode: 'MEDIUM' } }
            },
            {
              actions: ['Alexa.Actions.Lower'],
              directive: { name: 'AdjustMode', payload: { modeDelta: -1 } }
            },
            {
              actions: ['Alexa.Actions.Raise'],
              directive: { name: 'AdjustMode', payload: { modeDelta: 1 } }
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
          instance: 'Mode:mode1',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Mode'],
            supportedModes: {
              OFF: ['@Value.Off'],
              LOW: ['@Value.Low'],
              MEDIUM: ['@Value.Medium'],
              HIGH: ['@Value.High']
            },
            ordered: true,
            actionMappings: {
              Close: 'OFF',
              Open: 'MEDIUM',
              Lower: '(-1)',
              Raise: '(+1)'
            }
          },
          item: { name: 'mode1', type: 'String' }
        },
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: { OFF: 'OFF', ON: 'MEDIUM' },
          item: { name: 'mode1', type: 'String' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { STOP: 'OFF' },
          item: { name: 'mode1', type: 'String' }
        }
      ]
    },
    mode2: {
      capabilities: [
        'Alexa.ModeController:mode2.mode',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['OTHER'],
      friendlyName: 'Mode 2',
      propertyFlags: {
        'Alexa.ModeController:mode2': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:mode2': {
          friendlyNames: ['asset:Alexa.Setting.Mode']
        }
      },
      configuration: {
        'Alexa.ModeController:mode2': {
          ordered: false,
          supportedModes: {
            OFF: { friendlyNames: ['asset:Alexa.Value.Close'] },
            ON: { friendlyNames: ['asset:Alexa.Value.Open'] }
          }
        }
      },
      semantics: {
        'Alexa.ModeController:mode2': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close'],
              directive: { name: 'SetMode', payload: { mode: 'OFF' } }
            },
            {
              actions: ['Alexa.Actions.Open'],
              directive: { name: 'SetMode', payload: { mode: 'ON' } }
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
          instance: 'Mode:mode2',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Mode'],
            supportedModes: { OFF: ['@Value.Close'], ON: ['@Value.Open'] },
            actionMappings: { Close: 'OFF', Open: 'ON' }
          },
          item: { name: 'mode2', type: 'Switch' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { STOP: 'OFF' },
          item: { name: 'mode2', type: 'Switch' }
        }
      ]
    },
    mode3: {
      capabilities: ['Alexa.ModeController:mode3.mode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['OTHER'],
      friendlyName: 'Mode 3',
      propertyFlags: {
        'Alexa.ModeController:mode3': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:mode3': {
          friendlyNames: ['asset:Alexa.Setting.Mode']
        }
      },
      configuration: {
        'Alexa.ModeController:mode3': {
          ordered: false,
          supportedModes: {
            OFF: { friendlyNames: ['asset:Alexa.Value.Close'] },
            ON: { friendlyNames: ['asset:Alexa.Value.Open'] }
          }
        }
      },
      semantics: {}, // no semantics expected
      cookie: [
        {
          name: 'ModeController',
          instance: 'Mode:mode3',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Mode'],
            supportedModes: { OFF: ['@Value.Close'], ON: ['@Value.Open'] },
            ordered: false,
            actionMappings: { Close: 'FOO', Open: 'BAR', Lower: '(-1)', Raise: '(+1)' },
            stateMappings: { Closed: 'FOO', Open: 'BAR' }
          },
          item: { name: 'mode3', type: 'Switch' }
        }
      ]
    },
    range1: {
      capabilities: [
        'Alexa.ModeController:range1',
        'Alexa.RangeController:range1.rangeValue',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['OTHER'],
      friendlyName: 'Range Value 1',
      propertyFlags: {
        'Alexa.RangeController:range1': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:range1': {
          friendlyNames: ['asset:Alexa.Setting.Mode']
        },
        'Alexa.RangeController:range1': {
          friendlyNames: ['text:Range Value:en-US']
        }
      },
      configuration: {
        'Alexa.ModeController:range1': {
          ordered: false,
          supportedModes: {
            INCREASE: { friendlyNames: ['text:Increase:en-US'] },
            DECREASE: { friendlyNames: ['text:Decrease:en-US'] }
          }
        },
        'Alexa.RangeController:range1': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {}, // no semantics expected
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Stop']
      },
      cookie: [
        {
          name: 'ModeController',
          instance: 'Mode:range1',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Mode'],
            supportedModes: { INCREASE: ['@Value.Increase'], DECREASE: ['@Value.Decrease'] }
          },
          item: { name: 'range1', type: 'Dimmer' }
        },
        {
          name: 'RangeController',
          instance: 'Range:range1',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.RangeValue']
          },
          item: { name: 'range1', type: 'Dimmer' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { STOP: 'OFF' },
          item: { name: 'range1', type: 'Dimmer' }
        }
      ]
    },
    range2: {
      capabilities: [
        'Alexa.RangeController:range2.rangeValue',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['OTHER'],
      friendlyName: 'Range Value 2',
      propertyFlags: {
        'Alexa.RangeController:range2': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.RangeController:range2': {
          friendlyNames: ['text:Range Value:en-US']
        }
      },
      configuration: {
        'Alexa.RangeController:range2': {
          supportedRange: { minimumValue: 0, maximumValue: 10, precision: 1 }
        }
      },
      semantics: {}, // no semantics expected
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Stop']
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'Range:range2',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.RangeValue'],
            supportedRange: [0, 10, 1],
            actionMappings: { Close: '-1', Open: '11', Lower: '(-11)', Raise: '(+11)' },
            stateMappings: { Closed: '-1', Open: '10:1' }
          },
          item: { name: 'range2', type: 'Number' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { STOP: '0' },
          item: { name: 'range2', type: 'Number' }
        }
      ]
    },
    range3: {
      capabilities: ['Alexa.RangeController:range3.rangeValue', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['OTHER'],
      friendlyName: 'Range Value 3',
      propertyFlags: {
        'Alexa.RangeController:range3': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.RangeController:range3': {
          friendlyNames: ['text:Range Value:en-US']
        }
      },
      configuration: {
        'Alexa.RangeController:range3': {
          supportedRange: { minimumValue: 0, maximumValue: 10, precision: 1 }
        }
      },
      semantics: {}, // no semantics expected
      cookie: [
        {
          name: 'RangeController',
          instance: 'Range:range3',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.RangeValue']
          },
          item: { name: 'range3', type: 'Number:Dimensionless' }
        }
      ]
    },
    range4: {
      capabilities: [
        'Alexa.ModeController:range4',
        'Alexa.RangeController:range4.rangeValue',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['OTHER'],
      friendlyName: 'Range Value 4',
      propertyFlags: {
        'Alexa.RangeController:range4': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:range4': {
          friendlyNames: ['asset:Alexa.Setting.Mode']
        },
        'Alexa.RangeController:range4': {
          friendlyNames: ['text:Range Value:en-US']
        }
      },
      configuration: {
        'Alexa.ModeController:range4': {
          ordered: false,
          supportedModes: {
            UP: { friendlyNames: ['text:Up:en-US'] },
            DOWN: { friendlyNames: ['text:Down:en-US'] },
            STOP: { friendlyNames: ['text:Stop:en-US'] }
          }
        },
        'Alexa.RangeController:range4': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {}, // no semantics expected
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Stop']
      },
      cookie: [
        {
          name: 'ModeController',
          instance: 'Mode:range4',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Mode'],
            supportedModes: { UP: ['@Value.Up'], DOWN: ['@Value.Down'], STOP: ['@Value.Stop'] }
          },
          item: { name: 'range4', type: 'Rollershutter' }
        },
        {
          name: 'RangeController',
          instance: 'Range:range4',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.RangeValue']
          },
          item: { name: 'range4', type: 'Rollershutter' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { STOP: 'STOP' },
          item: { name: 'range4', type: 'Rollershutter' }
        }
      ]
    },
    range5: {
      capabilities: ['Alexa.RangeController:range5.rangeValue', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['OTHER'],
      friendlyName: 'Range Value 5',
      propertyFlags: {
        'Alexa.RangeController:range5': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.RangeController:range5': {
          friendlyNames: ['text:Range Value:en-US']
        }
      },
      configuration: {
        'Alexa.RangeController:range5': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {
        'Alexa.RangeController:range5': {
          StatesToRange: [
            {
              states: ['Alexa.States.Closed', 'Alexa.States.Open'],
              range: { minimumValue: 1, maximumValue: 100 }
            }
          ]
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'Range:range5',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.RangeValue'],
            stateMappings: { Closed: '1:100', Open: '1:100' }
          },
          item: { name: 'range5', type: 'Rollershutter' }
        }
      ]
    },
    range6: {
      capabilities: ['Alexa.RangeController:range6.rangeValue', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['OTHER'],
      friendlyName: 'Range Value 6',
      propertyFlags: {
        'Alexa.RangeController:range6': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: true
        }
      },
      resources: {
        'Alexa.RangeController:range6': {
          friendlyNames: ['text:Range Value:en-US']
        }
      },
      configuration: {
        'Alexa.RangeController:range6': {
          supportedRange: { minimumValue: 0, maximumValue: 10, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Angle.Degrees'
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'Range:range6',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.RangeValue'],
            nonControllable: true,
            unitOfMeasure: 'Angle.Degrees'
          },
          item: { name: 'range6', type: 'Number:Angle' }
        }
      ]
    },
    toggle1: {
      capabilities: ['Alexa.ToggleController:toggle1.toggleState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['OTHER'],
      friendlyName: 'Toggle State 1',
      propertyFlags: {
        'Alexa.ToggleController:toggle1': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ToggleController:toggle1': {
          friendlyNames: ['text:Toggle State:en-US']
        }
      },
      semantics: {}, // no semantics expected
      cookie: [
        {
          name: 'ToggleController',
          instance: 'Toggle:toggle1',
          property: 'toggleState',
          parameters: {
            capabilityNames: ['@Setting.ToggleState'],
            actionMappings: { Close: 'FOO', Open: 'BAR' },
            stateMappings: { Closed: 'FOO', Open: 'BAR' }
          },
          item: { name: 'toggle1', type: 'Switch' }
        }
      ]
    },
    toggle2: {
      capabilities: ['Alexa.ToggleController:toggle2.toggleState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['OTHER'],
      friendlyName: 'Toggle State 2',
      propertyFlags: {
        'Alexa.ToggleController:toggle2': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ToggleController:toggle2': {
          friendlyNames: ['text:Toggle State:en-US']
        }
      },
      semantics: {
        'Alexa.ToggleController:toggle2': {
          StatesToValue: [
            {
              states: ['Alexa.States.Closed', 'Alexa.States.Open'],
              value: 'ON'
            }
          ]
        }
      },
      cookie: [
        {
          name: 'ToggleController',
          instance: 'Toggle:toggle2',
          property: 'toggleState',
          parameters: {
            capabilityNames: ['@Setting.ToggleState'],
            stateMappings: { Closed: 'ON', Open: 'ON' },
            OFF: 'off',
            ON: 'on'
          },
          item: { name: 'toggle2', type: 'String' }
        }
      ]
    },
    toggle3: {
      capabilities: ['Alexa.ToggleController:toggle3.toggleState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['OTHER'],
      friendlyName: 'Toggle State 3',
      propertyFlags: {
        'Alexa.ToggleController:toggle3': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ToggleController:toggle3': {
          friendlyNames: ['text:Toggle State:en-US']
        }
      },
      cookie: [
        {
          name: 'ToggleController',
          instance: 'Toggle:toggle3',
          property: 'toggleState',
          parameters: {
            capabilityNames: ['@Setting.ToggleState'],
            OFF: '0',
            ON: '1'
          },
          item: { name: 'toggle3', type: 'Number' }
        }
      ]
    }
  }
};
