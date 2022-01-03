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
  description: 'water heater',
  items: [
    {
      type: 'Group',
      name: 'gWaterHeater',
      label: 'Water Heater',
      metadata: {
        alexa: {
          value: 'WaterHeater'
        }
      }
    },
    {
      type: 'Number',
      name: 'temperature',
      groupNames: ['gWaterHeater'],
      metadata: {
        alexa: {
          value: 'CurrentTemperature'
        }
      }
    },
    {
      type: 'Number',
      name: 'targetTemperature',
      groupNames: ['gWaterHeater'],
      metadata: {
        alexa: {
          value: 'TargetTemperature',
          config: {
            setpointRange: '90:150'
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'power',
      groupNames: ['gWaterHeater'],
      metadata: {
        alexa: {
          value: 'PowerState'
        }
      }
    }
  ],
  catalog: {
    '@Setting.TargetTemperature': [
      {
        text: 'Target Temperature',
        locale: 'en-US'
      }
    ]
  },
  settings: {
    regional: {
      language: 'en',
      measurementSystem: 'US',
      region: 'US'
    }
  },
  expected: {
    gWaterHeater: {
      capabilities: [
        'Alexa.RangeController:Temperature.rangeValue',
        'Alexa.RangeController:TargetTemperature.rangeValue',
        'Alexa.PowerController.powerState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['WATER_HEATER'],
      friendlyName: 'Water Heater',
      propertyFlags: {
        'Alexa.RangeController:Temperature': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: true
        },
        'Alexa.RangeController:TargetTemperature': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.RangeController:Temperature': {
          friendlyNames: ['asset:Alexa.Setting.Temperature']
        },
        'Alexa.RangeController:TargetTemperature': {
          friendlyNames: ['text:Target Temperature:en-US']
        }
      },
      configuration: {
        'Alexa.RangeController:Temperature': {
          supportedRange: { minimumValue: -58, maximumValue: 212, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Temperature.Fahrenheit'
        },
        'Alexa.RangeController:TargetTemperature': {
          supportedRange: { minimumValue: 90, maximumValue: 150, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Temperature.Fahrenheit'
        }
      }
    }
  }
};
