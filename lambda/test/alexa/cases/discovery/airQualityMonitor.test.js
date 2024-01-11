/**
 * Copyright (c) 2010-2024 Contributors to the openHAB project
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

export default {
  description: 'air quality monitor',
  items: [
    {
      type: 'Group',
      name: 'gAirQualityMonitor',
      label: 'Air Quality Monitor',
      metadata: {
        alexa: {
          value: 'AirQualityMonitor'
        }
      }
    },
    {
      type: 'Number:Dimensionless',
      name: 'humidity',
      groupNames: ['gAirQualityMonitor'],
      metadata: {
        alexa: {
          value: 'CurrentHumidity'
        }
      }
    },
    {
      type: 'Number:Temperature',
      name: 'temperature',
      groupNames: ['gAirQualityMonitor'],
      metadata: {
        alexa: {
          value: 'CurrentTemperature'
        }
      }
    }
  ],
  catalog: {
    '@Setting.Humidity': [
      {
        text: 'Humidity',
        locale: 'en-US'
      }
    ]
  },
  expected: {
    gAirQualityMonitor: {
      capabilities: [
        'Alexa.RangeController:Humidity.rangeValue',
        'Alexa.RangeController:Temperature.rangeValue',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['AIR_QUALITY_MONITOR'],
      friendlyName: 'Air Quality Monitor',
      propertyFlags: {
        'Alexa.RangeController:Humidity': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: true
        },
        'Alexa.RangeController:Temperature': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: true
        }
      },
      resources: {
        'Alexa.RangeController:Humidity': {
          friendlyNames: ['text:Humidity:en-US']
        },
        'Alexa.RangeController:Temperature': {
          friendlyNames: ['asset:Alexa.Setting.Temperature']
        }
      },
      configuration: {
        'Alexa.RangeController:Humidity': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        },
        'Alexa.RangeController:Temperature': {
          supportedRange: { minimumValue: -50, maximumValue: 100, precision: 0.5 },
          unitOfMeasure: 'Alexa.Unit.Temperature.Celsius'
        }
      }
    }
  }
};
