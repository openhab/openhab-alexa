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
      },
      members: [
        {
          type: 'Number',
          name: 'temperature',
          metadata: {
            alexa: {
              value: 'CurrentTemperature'
            }
          }
        },
        {
          type: 'Number',
          name: 'targetSetpoint',
          metadata: {
            alexa: {
              value: 'TargetTemperature'
            }
          }
        },
        {
          type: 'Switch',
          name: 'power',
          metadata: {
            alexa: {
              value: 'PowerState'
            }
          }
        }
      ]
    }
  ],
  expected: {
    gWaterHeater: {
      capabilities: [
        'Alexa.TemperatureSensor.temperature',
        'Alexa.ThermostatController.targetSetpoint',
        'Alexa.PowerController.powerState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['WATER_HEATER'],
      friendlyName: 'Water Heater'
    }
  }
};
