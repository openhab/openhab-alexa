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
  description: 'air conditioner',
  items: [
    {
      type: 'Group',
      name: 'gAirConditioner1',
      label: 'Air Conditioner 1',
      metadata: {
        alexa: {
          value: 'AirConditioner'
        }
      }
    },
    {
      type: 'Switch',
      name: 'power',
      groupNames: ['gAirConditioner1'],
      metadata: {
        alexa: {
          value: 'PowerState'
        }
      }
    },
    {
      type: 'Number:Temperature',
      name: 'temperature',
      groupNames: ['gAirConditioner1'],
      metadata: {
        alexa: {
          value: 'CurrentTemperature'
        }
      }
    },
    {
      type: 'Number:Temperature',
      name: 'targetTemperature',
      groupNames: ['gAirConditioner1'],
      metadata: {
        alexa: {
          value: 'TargetTemperature'
        }
      }
    },
    {
      type: 'Switch',
      name: 'airConditioner2',
      label: 'Air Conditioner 2',
      metadata: {
        alexa: {
          value: 'AirConditioner'
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
    gAirConditioner1: {
      capabilities: [
        'Alexa.PowerController.powerState',
        'Alexa.RangeController:Temperature.rangeValue',
        'Alexa.RangeController:TargetTemperature.rangeValue',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['AIR_CONDITIONER'],
      friendlyName: 'Air Conditioner 1',
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
          supportedRange: { minimumValue: 40, maximumValue: 90, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Temperature.Fahrenheit'
        }
      }
    },
    airConditioner2: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['AIR_CONDITIONER'],
      friendlyName: 'Air Conditioner 2'
    }
  }
};
