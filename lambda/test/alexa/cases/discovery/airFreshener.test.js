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
  description: 'air freshener',
  items: [
    {
      type: 'Dimmer',
      name: 'airFreshener',
      label: 'Air Freshener',
      metadata: {
        alexa: {
          value: 'AirFreshener'
        }
      }
    }
  ],
  catalog: {
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
    airFreshener: {
      capabilities: [
        'Alexa.RangeController:FanSpeed.rangeValue',
        'Alexa.PowerController.powerState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['AIR_FRESHENER'],
      friendlyName: 'Air Freshener',
      resources: {
        'Alexa.RangeController:FanSpeed': {
          friendlyNames: ['text:Speed:en-US', 'asset:Alexa.Setting.FanSpeed']
        }
      },
      configuration: {
        'Alexa.RangeController:FanSpeed': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          presets: {
            0: {
              friendlyNames: ['text:Off:en-US']
            },
            33: {
              friendlyNames: ['asset:Alexa.Value.Low', 'asset:Alexa.Value.Minimum']
            },
            66: {
              friendlyNames: ['asset:Alexa.Value.Medium']
            },
            100: {
              friendlyNames: ['asset:Alexa.Value.High', 'asset:Alexa.Value.Maximum']
            }
          },
          unitOfMeasure: 'Alexa.Unit.Percent'
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
            presets: {
              0: ['@Value.Off'],
              33: ['@Value.Low', '@Value.Minimum'],
              66: ['@Value.Medium'],
              100: ['@Value.High', '@Value.Maximum']
            }
          },
          item: { name: 'airFreshener', type: 'Dimmer' }
        },
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: {},
          item: { name: 'airFreshener', type: 'Dimmer' }
        }
      ]
    }
  }
};
