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
  description: 'wearable',
  items: [
    {
      type: 'Group',
      name: 'gSmartWatch',
      label: 'Smart Watch',
      metadata: {
        alexa: {
          value: 'Wearable'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'batteryLevel',
      groupNames: ['gSmartWatch'],
      metadata: {
        alexa: {
          value: 'BatteryLevel'
        }
      }
    },
    {
      type: 'Number',
      name: 'steps',
      label: 'Steps',
      groupNames: ['gSmartWatch'],
      stateDescription: {
        minimum: 0,
        maximum: 100000,
        step: 1,
        readOnly: true
      },
      metadata: {
        alexa: {
          value: 'RangeValue'
        }
      }
    }
  ],
  catalog: {
    '@Setting.BatteryLevel': [
      {
        text: 'Battery Level',
        locale: 'en-US'
      }
    ]
  },
  expected: {
    gSmartWatch: {
      capabilities: [
        'Alexa.RangeController:BatteryLevel.rangeValue',
        'Alexa.RangeController:steps.rangeValue',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['WEARABLE'],
      friendlyName: 'Smart Watch',
      propertyFlags: {
        'Alexa.RangeController:BatteryLevel': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: true
        },
        'Alexa.RangeController:steps': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: true
        }
      },
      resources: {
        'Alexa.RangeController:BatteryLevel': {
          friendlyNames: ['text:Battery Level:en-US']
        },
        'Alexa.RangeController:steps': {
          friendlyNames: [
            'text:Steps:en-AU',
            'text:Steps:en-CA',
            'text:Steps:en-GB',
            'text:Steps:en-IN',
            'text:Steps:en-US'
          ]
        }
      },
      configuration: {
        'Alexa.RangeController:BatteryLevel': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        },
        'Alexa.RangeController:steps': {
          supportedRange: { minimumValue: 0, maximumValue: 100000, precision: 1 }
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'BatteryLevel',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.BatteryLevel'],
            nonControllable: true,
            supportedRange: [0, 100, 1],
            unitOfMeasure: 'Percent'
          },
          item: { name: 'batteryLevel', type: 'Dimmer' }
        },
        {
          name: 'RangeController',
          instance: 'Range:steps',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['Steps'],
            nonControllable: true,
            supportedRange: [0, 100000, 1]
          },
          item: { name: 'steps', type: 'Number' }
        }
      ]
    }
  }
};
