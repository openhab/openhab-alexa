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
  description: 'fan',
  items: [
    {
      type: 'Group',
      name: 'gFan1',
      metadata: {
        alexa: {
          value: 'Endpoint.FAN',
          config: {
            name: 'Fan 1',
            description: 'Super Smart Fan'
          }
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'fanSpeed1',
      groupNames: ['gFan1'],
      stateDescription: {
        pattern: '%d %%'
      },
      metadata: {
        alexa: {
          value: 'RangeController.rangeValue,InvalidController.property',
          config: {
            capabilityNames: '@Setting.FanSpeed,Air Speed',
            supportedRange: '0:100:10',
            presets:
              // presets 42 (not multiple of precision), 50 (no label) and 142 (above max range) not valid
              '10=@Value.Minimum:@Value.Low:Lowest,100=@Value.Maximum:@Value.High:Highest,42=invalid,50,142=invalid'
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'fanOscillate1',
      groupNames: ['gFan1'],
      metadata: {
        alexa: {
          value: 'ToggleController.toggleState',
          config: {
            capabilityNames: ['@Setting.Oscillate', 'Rotate']
          }
        }
      }
    },
    {
      type: 'Number:Angle',
      name: 'fanAngle1',
      label: 'Fan Angle',
      groupNames: ['gFan1'],
      stateDescription: {
        minimum: 0,
        maximum: 120,
        step: 20,
        options: [
          { value: '60', label: 'Center' },
          { value: 'invalid', label: 'Non-numerical' }
        ]
      },
      metadata: {
        alexa: {
          value: 'RangeController.rangeValue'
        },
        synonyms: {
          value: 'Orientation'
        }
      }
    },
    {
      type: 'Switch',
      name: 'power1',
      groupNames: ['gFan1'],
      metadata: {
        alexa: {
          value: 'Switchable'
        }
      }
    },
    {
      type: 'Group',
      name: 'gFan2',
      label: 'Fan 2',
      metadata: {
        alexa: {
          value: 'Fan'
        }
      }
    },
    {
      type: 'Number',
      name: 'fanSpeed2',
      groupNames: ['gFan2'],
      metadata: {
        alexa: {
          value: 'FanSpeed,PowerState',
          config: {
            speedLevels: 6,
            OFF: 0,
            ON: 2
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'fanOscillate2',
      groupNames: ['gFan2'],
      metadata: {
        alexa: {
          value: 'FanOscillate'
        }
      }
    },
    {
      type: 'Switch',
      name: 'fanDirection2',
      groupNames: ['gFan2'],
      metadata: {
        alexa: {
          value: 'FanDirection'
        }
      }
    },
    {
      type: 'Group',
      name: 'gFan3',
      label: 'Fan 3',
      metadata: {
        alexa: {
          value: 'Fan'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'fanSpeed3',
      groupNames: ['gFan3'],
      metadata: {
        alexa: {
          value: 'FanSpeed',
          config: {
            inverted: true
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'fanDirection3',
      groupNames: ['gFan3'],
      metadata: {
        alexa: {
          value: 'FanDirection',
          config: {
            inverted: true
          }
        }
      }
    },
    {
      type: 'Group',
      name: 'gFan4',
      label: 'Fan 4',
      metadata: {
        alexa: {
          value: 'Fan'
        }
      }
    },
    {
      type: 'String',
      name: 'fanSpeed4',
      groupNames: ['gFan4'],
      metadata: {
        alexa: {
          value: 'FanSpeed'
        }
      }
    },
    {
      type: 'String',
      name: 'fanDirection4',
      groupNames: ['gFan4'],
      metadata: {
        alexa: {
          value: 'FanDirection'
        }
      }
    },
    {
      type: 'Number',
      name: 'fanSpeed5',
      label: 'Fan Speed 5',
      metadata: {
        alexa: {
          value: 'FanSpeed',
          config: {
            speedLevels: 1 // speed levels too low
          }
        }
      }
    }
  ],
  catalog: {
    '@Setting.Forward': [
      {
        text: 'Forward',
        locale: 'en-US'
      }
    ],
    '@Setting.Reverse': [
      {
        text: 'Reverse',
        locale: 'en-US'
      }
    ],
    '@Setting.Speed': [
      {
        text: 'Speed',
        locale: 'en-US'
      }
    ],
    '@Value.Off': [
      {
        text: 'Off',
        locale: 'en-US'
      }
    ]
  },
  expected: {
    gFan1: {
      capabilities: [
        'Alexa.RangeController:fanSpeed1.rangeValue',
        'Alexa.ToggleController:fanOscillate1.toggleState',
        'Alexa.RangeController:fanAngle1.rangeValue',
        'Alexa.PowerController.powerState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['FAN'],
      description: 'Super Smart Fan via openHAB',
      friendlyName: 'Fan 1',
      propertyFlags: {
        'Alexa.RangeController:fanAngle1': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.RangeController:fanSpeed1': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.ToggleController:fanOscillate1': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.RangeController:fanAngle1': {
          friendlyNames: [
            'text:Fan Angle:en-AU',
            'text:Fan Angle:en-CA',
            'text:Fan Angle:en-GB',
            'text:Fan Angle:en-IN',
            'text:Fan Angle:en-US',
            'text:Orientation:en-AU',
            'text:Orientation:en-CA',
            'text:Orientation:en-GB',
            'text:Orientation:en-IN',
            'text:Orientation:en-US'
          ]
        },
        'Alexa.RangeController:fanSpeed1': {
          friendlyNames: [
            'asset:Alexa.Setting.FanSpeed',
            'text:Air Speed:en-AU',
            'text:Air Speed:en-CA',
            'text:Air Speed:en-GB',
            'text:Air Speed:en-IN',
            'text:Air Speed:en-US'
          ]
        },
        'Alexa.ToggleController:fanOscillate1': {
          friendlyNames: [
            'asset:Alexa.Setting.Oscillate',
            'text:Rotate:en-AU',
            'text:Rotate:en-CA',
            'text:Rotate:en-GB',
            'text:Rotate:en-IN',
            'text:Rotate:en-US'
          ]
        }
      },
      configuration: {
        'Alexa.RangeController:fanAngle1': {
          supportedRange: { minimumValue: 0, maximumValue: 120, precision: 20 },
          unitOfMeasure: 'Alexa.Unit.Angle.Degrees',
          presets: {
            60: {
              friendlyNames: [
                'text:Center:en-AU',
                'text:Center:en-CA',
                'text:Center:en-GB',
                'text:Center:en-IN',
                'text:Center:en-US'
              ]
            }
          }
        },
        'Alexa.RangeController:fanSpeed1': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 10 },
          unitOfMeasure: 'Alexa.Unit.Percent',
          presets: {
            10: {
              friendlyNames: [
                'asset:Alexa.Value.Minimum',
                'asset:Alexa.Value.Low',
                'text:Lowest:en-AU',
                'text:Lowest:en-CA',
                'text:Lowest:en-GB',
                'text:Lowest:en-IN',
                'text:Lowest:en-US'
              ]
            },
            100: {
              friendlyNames: [
                'asset:Alexa.Value.Maximum',
                'asset:Alexa.Value.High',
                'text:Highest:en-AU',
                'text:Highest:en-CA',
                'text:Highest:en-GB',
                'text:Highest:en-IN',
                'text:Highest:en-US'
              ]
            }
          }
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'Range:fanAngle1',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['Fan Angle', 'Orientation'],
            supportedRange: [0, 120, 20],
            unitOfMeasure: 'Angle.Degrees',
            presets: {
              60: ['Center']
            }
          },
          item: { name: 'fanAngle1', type: 'Number:Angle' }
        },
        {
          name: 'RangeController',
          instance: 'Range:fanSpeed1',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.FanSpeed', 'Air Speed'],
            supportedRange: [0, 100, 10],
            unitOfMeasure: 'Percent',
            presets: {
              10: ['@Value.Minimum', '@Value.Low', 'Lowest'],
              100: ['@Value.Maximum', '@Value.High', 'Highest']
            }
          },
          item: { name: 'fanSpeed1', type: 'Dimmer' }
        },
        {
          name: 'ToggleController',
          instance: 'Toggle:fanOscillate1',
          property: 'toggleState',
          parameters: {
            capabilityNames: ['@Setting.Oscillate', 'Rotate']
          },
          item: { name: 'fanOscillate1', type: 'Switch' }
        }
      ]
    },
    gFan2: {
      capabilities: [
        'Alexa.RangeController:FanSpeed.rangeValue',
        'Alexa.PowerController.powerState',
        'Alexa.ToggleController:FanOscillate.toggleState',
        'Alexa.ModeController:FanDirection.mode',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['FAN'],
      description: 'Group gFan2 via openHAB',
      friendlyName: 'Fan 2',
      propertyFlags: {
        'Alexa.RangeController:FanSpeed': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.ToggleController:FanOscillate': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.ModeController:FanDirection': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.RangeController:FanSpeed': {
          friendlyNames: ['text:Speed:en-US', 'asset:Alexa.Setting.FanSpeed']
        },
        'Alexa.ToggleController:FanOscillate': {
          friendlyNames: ['asset:Alexa.Setting.Oscillate']
        },
        'Alexa.ModeController:FanDirection': {
          friendlyNames: ['asset:Alexa.Setting.Direction']
        }
      },
      configuration: {
        'Alexa.RangeController:FanSpeed': {
          supportedRange: { minimumValue: 0, maximumValue: 6, precision: 1 },
          presets: {
            0: {
              friendlyNames: ['text:Off:en-US']
            },
            1: {
              friendlyNames: ['asset:Alexa.Value.Low', 'asset:Alexa.Value.Minimum']
            },
            3: {
              friendlyNames: ['asset:Alexa.Value.Medium']
            },
            6: {
              friendlyNames: ['asset:Alexa.Value.High', 'asset:Alexa.Value.Maximum']
            }
          }
        },
        'Alexa.ModeController:FanDirection': {
          ordered: false,
          supportedModes: {
            ON: {
              friendlyNames: ['text:Forward:en-US']
            },
            OFF: {
              friendlyNames: ['text:Reverse:en-US']
            }
          }
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'FanSpeed',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.Speed', '@Setting.FanSpeed'],
            supportedRange: [0, 6, 1],
            presets: {
              0: ['@Value.Off'],
              1: ['@Value.Low', '@Value.Minimum'],
              3: ['@Value.Medium'],
              6: ['@Value.High', '@Value.Maximum']
            }
          },
          item: { name: 'fanSpeed2', type: 'Number' }
        },
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: {
            OFF: 0,
            ON: 2
          },
          item: { name: 'fanSpeed2', type: 'Number' }
        },
        {
          name: 'ToggleController',
          instance: 'FanOscillate',
          property: 'toggleState',
          parameters: {
            capabilityNames: ['@Setting.Oscillate']
          },
          item: { name: 'fanOscillate2', type: 'Switch' }
        },
        {
          name: 'ModeController',
          instance: 'FanDirection',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Direction'],
            supportedModes: {
              ON: ['@Setting.Forward'],
              OFF: ['@Setting.Reverse']
            }
          },
          item: { name: 'fanDirection2', type: 'Switch' }
        }
      ]
    },
    gFan3: {
      capabilities: [
        'Alexa.RangeController:FanSpeed.rangeValue',
        'Alexa.ModeController:FanDirection.mode',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['FAN'],
      description: 'Group gFan3 via openHAB',
      friendlyName: 'Fan 3',
      propertyFlags: {
        'Alexa.RangeController:FanSpeed': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.ModeController:FanDirection': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.RangeController:FanSpeed': {
          friendlyNames: ['text:Speed:en-US', 'asset:Alexa.Setting.FanSpeed']
        },
        'Alexa.ModeController:FanDirection': {
          friendlyNames: ['asset:Alexa.Setting.Direction']
        }
      },
      configuration: {
        'Alexa.RangeController:FanSpeed': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          presets: {
            100: {
              friendlyNames: ['text:Off:en-US']
            },
            66: {
              friendlyNames: ['asset:Alexa.Value.Low', 'asset:Alexa.Value.Minimum']
            },
            33: {
              friendlyNames: ['asset:Alexa.Value.Medium']
            },
            0: {
              friendlyNames: ['asset:Alexa.Value.High', 'asset:Alexa.Value.Maximum']
            }
          },
          unitOfMeasure: 'Alexa.Unit.Percent'
        },
        'Alexa.ModeController:FanDirection': {
          ordered: false,
          supportedModes: {
            ON: {
              friendlyNames: ['text:Reverse:en-US']
            },
            OFF: {
              friendlyNames: ['text:Forward:en-US']
            }
          }
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'FanSpeed',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.Speed', '@Setting.FanSpeed'],
            supportedRange: [0, 100, 1],
            unitOfMeasure: 'Percent',
            inverted: true,
            presets: {
              100: ['@Value.Off'],
              66: ['@Value.Low', '@Value.Minimum'],
              33: ['@Value.Medium'],
              0: ['@Value.High', '@Value.Maximum']
            }
          },
          item: { name: 'fanSpeed3', type: 'Dimmer' }
        },
        {
          name: 'ModeController',
          instance: 'FanDirection',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Direction'],
            supportedModes: {
              ON: ['@Setting.Reverse'],
              OFF: ['@Setting.Forward']
            }
          },
          item: { name: 'fanDirection3', type: 'Switch' }
        }
      ]
    },
    gFan4: {
      capabilities: [
        'Alexa.ModeController:FanSpeed.mode',
        'Alexa.ModeController:FanDirection.mode',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['FAN'],
      description: 'Group gFan4 via openHAB',
      friendlyName: 'Fan 4',
      propertyFlags: {
        'Alexa.ModeController:FanSpeed': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.ModeController:FanDirection': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:FanSpeed': {
          friendlyNames: ['text:Speed:en-US', 'asset:Alexa.Setting.FanSpeed']
        },
        'Alexa.ModeController:FanDirection': {
          friendlyNames: ['asset:Alexa.Setting.Direction']
        }
      },
      configuration: {
        'Alexa.ModeController:FanSpeed': {
          ordered: true,
          supportedModes: {
            OFF: {
              friendlyNames: ['text:Off:en-US']
            },
            LOW: {
              friendlyNames: ['asset:Alexa.Value.Low', 'asset:Alexa.Value.Minimum']
            },
            MEDIUM: {
              friendlyNames: ['asset:Alexa.Value.Medium']
            },
            HIGH: {
              friendlyNames: ['asset:Alexa.Value.High', 'asset:Alexa.Value.Maximum']
            }
          }
        },
        'Alexa.ModeController:FanDirection': {
          ordered: false,
          supportedModes: {
            FORWARD: {
              friendlyNames: ['text:Forward:en-US']
            },
            REVERSE: {
              friendlyNames: ['text:Reverse:en-US']
            }
          }
        }
      },
      cookie: [
        {
          name: 'ModeController',
          instance: 'FanSpeed',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Speed', '@Setting.FanSpeed'],
            ordered: true,
            supportedModes: {
              OFF: ['@Value.Off'],
              LOW: ['@Value.Low', '@Value.Minimum'],
              MEDIUM: ['@Value.Medium'],
              HIGH: ['@Value.High', '@Value.Maximum']
            }
          },
          item: { name: 'fanSpeed4', type: 'String' }
        },
        {
          name: 'ModeController',
          instance: 'FanDirection',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Direction'],
            supportedModes: {
              FORWARD: ['@Setting.Forward'],
              REVERSE: ['@Setting.Reverse']
            }
          },
          item: { name: 'fanDirection4', type: 'String' }
        }
      ]
    }
  }
};
