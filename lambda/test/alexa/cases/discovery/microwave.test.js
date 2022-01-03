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
  description: 'microwave',
  items: [
    {
      type: 'Group',
      name: 'gMicrowave',
      label: 'Microwave',
      metadata: {
        alexa: {
          value: 'Microwave'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'MicrowavePowerLevel',
      label: 'Power Level',
      groupNames: ['gMicrowave'],
      metadata: {
        alexa: {
          value: 'RangeValue',
          config: {
            supportedRange: '0:100:10',
            unitOfMeasure: 'Percent',
            presets: { 0: '@Value.Minimum', 100: '@Value.Maximum' }
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'MicrowaveSurfaceLight',
      label: 'Surface Light',
      groupNames: ['gMicrowave'],
      metadata: {
        alexa: {
          value: 'RangeValue',
          config: {
            supportedRange: '0:2:1',
            presets: { 0: '@Value.Off', 1: '@Setting.Night', 2: '@Value.On' }
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'MicrowaveTurnTable',
      label: 'Turn Table',
      groupNames: ['gMicrowave'],
      metadata: {
        alexa: {
          value: 'ToggleState'
        }
      }
    }
  ],
  catalog: {
    '@Value.Off': [
      {
        text: 'Off',
        locale: 'en-US'
      }
    ],
    '@Value.On': [
      {
        text: 'On',
        locale: 'en-US'
      }
    ]
  },
  expected: {
    gMicrowave: {
      capabilities: [
        'Alexa.RangeController:MicrowavePowerLevel.rangeValue',
        'Alexa.RangeController:MicrowaveSurfaceLight.rangeValue',
        'Alexa.ToggleController:MicrowaveTurnTable.toggleState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['MICROWAVE'],
      friendlyName: 'Microwave',
      propertyFlags: {
        'Alexa.RangeController:MicrowavePowerLevel': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.RangeController:MicrowaveSurfaceLight': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.ToggleController:MicrowaveTurnTable': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.RangeController:MicrowavePowerLevel': {
          friendlyNames: [
            'text:Power Level:en-AU',
            'text:Power Level:en-CA',
            'text:Power Level:en-GB',
            'text:Power Level:en-IN',
            'text:Power Level:en-US'
          ]
        },
        'Alexa.RangeController:MicrowaveSurfaceLight': {
          friendlyNames: [
            'text:Surface Light:en-AU',
            'text:Surface Light:en-CA',
            'text:Surface Light:en-GB',
            'text:Surface Light:en-IN',
            'text:Surface Light:en-US'
          ]
        },
        'Alexa.ToggleController:MicrowaveTurnTable': {
          friendlyNames: [
            'text:Turn Table:en-AU',
            'text:Turn Table:en-CA',
            'text:Turn Table:en-GB',
            'text:Turn Table:en-IN',
            'text:Turn Table:en-US'
          ]
        }
      },
      configuration: {
        'Alexa.RangeController:MicrowavePowerLevel': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 10 },
          unitOfMeasure: 'Alexa.Unit.Percent',
          presets: {
            0: {
              friendlyNames: ['asset:Alexa.Value.Minimum']
            },
            100: {
              friendlyNames: ['asset:Alexa.Value.Maximum']
            }
          }
        },
        'Alexa.RangeController:MicrowaveSurfaceLight': {
          supportedRange: { minimumValue: 0, maximumValue: 2, precision: 1 },
          presets: {
            0: {
              friendlyNames: ['text:Off:en-US']
            },
            1: {
              friendlyNames: ['asset:Alexa.Setting.Night']
            },
            2: {
              friendlyNames: ['text:On:en-US']
            }
          }
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'Range:MicrowavePowerLevel',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['Power Level'],
            supportedRange: [0, 100, 10],
            unitOfMeasure: 'Percent',
            presets: { 0: ['@Value.Minimum'], 100: ['@Value.Maximum'] }
          },
          item: { name: 'MicrowavePowerLevel', type: 'Dimmer' }
        },
        {
          name: 'RangeController',
          instance: 'Range:MicrowaveSurfaceLight',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['Surface Light'],
            supportedRange: [0, 2, 1],
            presets: { 0: ['@Value.Off'], 1: ['@Setting.Night'], 2: ['@Value.On'] }
          },
          item: { name: 'MicrowaveSurfaceLight', type: 'Number' }
        },
        {
          name: 'ToggleController',
          instance: 'Toggle:MicrowaveTurnTable',
          property: 'toggleState',
          parameters: {
            capabilityNames: ['Turn Table']
          },
          item: { name: 'MicrowaveTurnTable', type: 'Switch' }
        }
      ]
    }
  }
};
