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
  description: 'temperature sensor',
  items: [
    {
      type: 'Number:Temperature',
      name: 'temperature1',
      label: 'Temperature Sensor 1',
      metadata: {
        alexa: {
          value: 'TemperatureSensor'
        }
      }
    },
    {
      type: 'Number',
      name: 'temperature2',
      label: 'Temperature Sensor 2',
      metadata: {
        alexa: {
          value: 'CurrentTemperature',
          config: {
            scale: 'Fahrenheit'
          }
        }
      }
    },
    {
      type: 'Number:Temperature',
      name: 'temperature3',
      label: 'Temperature Sensor 3',
      stateDescription: {
        pattern: '%.1f °F'
      },
      metadata: {
        alexa: {
          value: 'CurrentTemperature'
        }
      }
    },
    {
      type: 'Number',
      name: 'temperature4',
      label: 'Temperature Sensor 4',
      stateDescription: {
        pattern: '%.1f' // no symbol in state presentation
      },
      metadata: {
        alexa: {
          value: 'CurrentTemperature'
        }
      }
    },
    {
      type: 'Number',
      name: 'temperature5',
      label: 'Temperature Sensor 5',
      metadata: {
        alexa: {
          value: 'TemperatureSensor.temperature' // backward compatibility
        }
      }
    }
  ],
  expected: {
    temperature1: {
      capabilities: ['Alexa.TemperatureSensor.temperature', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['TEMPERATURE_SENSOR'],
      friendlyName: 'Temperature Sensor 1'
    },
    temperature2: {
      capabilities: ['Alexa.TemperatureSensor.temperature', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['TEMPERATURE_SENSOR'],
      friendlyName: 'Temperature Sensor 2',
      cookie: [
        {
          name: 'TemperatureSensor',
          property: 'temperature',
          parameters: { scale: 'FAHRENHEIT' },
          item: { name: 'temperature2', type: 'Number' }
        }
      ]
    },
    temperature3: {
      capabilities: ['Alexa.TemperatureSensor.temperature', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['TEMPERATURE_SENSOR'],
      friendlyName: 'Temperature Sensor 3',
      cookie: [
        {
          name: 'TemperatureSensor',
          property: 'temperature',
          parameters: { scale: 'FAHRENHEIT' },
          item: { name: 'temperature3', type: 'Number:Temperature' }
        }
      ]
    },
    temperature4: {
      capabilities: ['Alexa.TemperatureSensor.temperature', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['TEMPERATURE_SENSOR'],
      friendlyName: 'Temperature Sensor 4',
      cookie: [
        {
          name: 'TemperatureSensor',
          property: 'temperature',
          parameters: { scale: 'CELSIUS' },
          item: { name: 'temperature4', type: 'Number' }
        }
      ]
    },
    temperature5: {
      capabilities: ['Alexa.TemperatureSensor.temperature', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['TEMPERATURE_SENSOR'],
      friendlyName: 'Temperature Sensor 5'
    }
  }
};
