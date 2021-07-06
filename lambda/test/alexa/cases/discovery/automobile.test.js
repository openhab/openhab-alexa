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
  description: 'automobile',
  items: [
    {
      type: 'Group',
      name: 'gAutomobile',
      label: 'Automobile',
      metadata: {
        alexa: {
          value: 'Automobile'
        }
      },
      members: [
        {
          type: 'Number:Dimensionless',
          name: 'batteryLevel',
          metadata: {
            alexa: {
              value: 'BatteryLevel'
            }
          }
        },
        {
          type: 'Number:Temperature',
          name: 'temperature',
          metadata: {
            alexa: {
              value: 'CurrentTemperature'
            }
          }
        }
      ]
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
    gAutomobile: {
      capabilities: [
        'Alexa.RangeController:BatteryLevel.rangeValue',
        'Alexa.TemperatureSensor.temperature',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['VEHICLE'],
      friendlyName: 'Automobile',
      propertyFlags: {
        'Alexa.RangeController:BatteryLevel': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: true
        }
      },
      resources: {
        'Alexa.RangeController:BatteryLevel': {
          friendlyNames: ['text:Battery Level:en-US']
        }
      },
      configuration: {
        'Alexa.RangeController:BatteryLevel': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
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
          item: { name: 'batteryLevel', type: 'Number:Dimensionless' }
        },
        {
          name: 'TemperatureSensor',
          property: 'temperature',
          parameters: { scale: 'CELSIUS' },
          item: { name: 'temperature', type: 'Number:Temperature' }
        }
      ]
    }
  }
};
