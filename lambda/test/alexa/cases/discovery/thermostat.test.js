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
  description: 'thermostat',
  items: [
    {
      type: 'Group',
      name: 'gThermostat1',
      label: 'Thermostat 1',
      tags: ['Thermostat', 'Celsius']
    },
    {
      type: 'Number',
      name: 'currentHumidity1',
      groupNames: ['gThermostat1'],
      tags: ['CurrentHumidity']
    },
    {
      type: 'Number',
      name: 'currentTemperature1',
      groupNames: ['gThermostat1'],
      tags: ['CurrentTemperature']
    },
    {
      type: 'Number',
      name: 'targetTemperature1',
      groupNames: ['gThermostat1'],
      tags: ['TargetTemperature']
    },
    {
      type: 'Number',
      name: 'highTargetTemperature1',
      groupNames: ['gThermostat1'],
      tags: ['UpperTemperature']
    },
    {
      type: 'Number',
      name: 'lowTargetTemperature1',
      groupNames: ['gThermostat1'],
      tags: ['LowerTemperature']
    },
    {
      type: 'String',
      name: 'thermostatMode1',
      groupNames: ['gThermostat1'],
      tags: ['homekit:HeatingCoolingMode']
    },
    {
      type: 'Group',
      name: 'gThermostat2',
      label: 'Thermostat 2',
      metadata: {
        alexa: {
          value: 'Thermostat'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'currentHumidity2',
      groupNames: ['gThermostat2'],
      metadata: {
        alexa: {
          value: 'CurrentHumidity',
          config: {
            scale: 'Fahrenheit'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'currentTemperature2',
      groupNames: ['gThermostat2'],
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
      type: 'Number',
      name: 'targetTemperature2',
      groupNames: ['gThermostat2'],
      metadata: {
        alexa: {
          value: 'TargetTemperature',
          config: {
            scale: 'Fahrenheit'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'coolingSetpoint2',
      groupNames: ['gThermostat2'],
      metadata: {
        alexa: {
          value: 'CoolingSetpoint',
          config: {
            scale: 'Fahrenheit',
            comfortRange: 5
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'heatingSetpoint2',
      groupNames: ['gThermostat2'],
      metadata: {
        alexa: {
          value: 'HeatingSetpoint',
          config: {
            scale: 'Fahrenheit',
            comfortRange: 5
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'ecoCoolingSetpoint2',
      groupNames: ['gThermostat2'],
      metadata: {
        alexa: {
          value: 'EcoCoolingSetpoint',
          config: {
            scale: 'Fahrenheit'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'ecoHeatingSetpoint2',
      groupNames: ['gThermostat2'],
      metadata: {
        alexa: {
          value: 'EcoHeatingSetpoint',
          config: {
            scale: 'Fahrenheit'
          }
        }
      }
    },
    {
      type: 'String',
      name: 'thermostatMode2',
      groupNames: ['gThermostat2'],
      metadata: {
        alexa: {
          value: 'HeatingCoolingMode',
          config: {
            OFF: 'off',
            HEAT: 'heat',
            FOOBAR: 'foobar'
          }
        },
        channel: {
          value: 'foobar:thermostat:mode'
        }
      }
    },
    {
      type: 'Switch',
      name: 'thermostatHold2',
      groupNames: ['gThermostat2'],
      metadata: {
        alexa: {
          value: 'ThermostatHold'
        }
      }
    },
    {
      type: 'String',
      name: 'thermostatFan2',
      groupNames: ['gThermostat2'],
      metadata: {
        alexa: {
          value: 'ThermostatFan'
        }
      }
    },
    {
      type: 'Group',
      name: 'gThermostat3',
      label: 'Thermostat 3',
      metadata: {
        alexa: {
          value: 'Thermostat',
          config: {
            scale: 'Fahrenheit'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'targetTemperature3',
      groupNames: ['gThermostat3'],
      metadata: {
        alexa: {
          value: 'TargetTemperature',
          config: {
            setpointRange: '60:90'
          }
        }
      }
    },
    {
      // Ignored due to no CoolingSetpoint item defined
      type: 'Number',
      name: 'heatingSetpoint3',
      groupNames: ['gThermostat3'],
      metadata: {
        alexa: {
          value: 'HeatingSetpoint'
        }
      }
    },
    {
      type: 'Switch',
      name: 'thermostatMode3',
      groupNames: ['gThermostat3'],
      metadata: {
        alexa: {
          value: 'HeatingCoolingMode'
        }
      }
    },
    {
      type: 'Switch',
      name: 'thermostatFan3',
      groupNames: ['gThermostat3'],
      metadata: {
        alexa: {
          value: 'ThermostatFan'
        }
      }
    },
    {
      type: 'Number',
      name: 'thermostat4',
      label: 'Thermostat 4',
      metadata: {
        alexa: {
          value: 'Thermostat',
          config: {
            supportedModes: 'OFF,HEAT,COOL,FOOBAR'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'thermostat5',
      label: 'Thermostat 5',
      metadata: {
        alexa: {
          value: 'HeatingCoolingMode'
        }
      }
    },
    {
      type: 'Number',
      name: 'thermostat6',
      label: 'Thermostat 6',
      metadata: {
        alexa: {
          value: 'TargetTemperature'
        }
      }
    },
    {
      type: 'String',
      name: 'broadlinkThermostat',
      label: 'Broadlink Thermostat',
      metadata: {
        alexa: {
          value: 'Thermostat'
        },
        channel: {
          value: 'broadlinkthermostat:thermostat:mode'
        }
      }
    },
    {
      type: 'String',
      name: 'daikinThermostat',
      label: 'Daikin Thermostat',
      metadata: {
        alexa: {
          value: 'Thermostat'
        },
        channel: {
          value: 'daikin:thermostat:mode'
        }
      }
    },
    {
      type: 'String',
      name: 'ecobeeThermostat',
      label: 'Ecobee Thermostat',
      metadata: {
        alexa: {
          value: 'Thermostat'
        },
        channel: {
          value: 'ecobee:thermostat:mode'
        }
      }
    },
    {
      type: 'Number',
      name: 'insteonThermostat',
      label: 'Insteon Thermostat',
      metadata: {
        alexa: {
          value: 'Thermostat'
        },
        channel: {
          value: 'insteon:thermostat:mode'
        }
      }
    },
    {
      type: 'String',
      name: 'maxThermostat',
      label: 'Max Thermostat',
      metadata: {
        alexa: {
          value: 'Thermostat'
        },
        channel: {
          value: 'max:thermostat:mode'
        }
      }
    },
    {
      type: 'String',
      name: 'nestThermostat',
      label: 'Nest Thermostat',
      metadata: {
        alexa: {
          value: 'Thermostat'
        },
        channel: {
          value: 'nest:thermostat:mode'
        }
      }
    },
    {
      type: 'Number',
      name: 'radioThermostat',
      label: 'Radio Thermostat',
      metadata: {
        alexa: {
          value: 'Thermostat'
        },
        channel: {
          value: 'radiothermostat:thermostat:mode'
        }
      }
    },
    {
      type: 'String',
      name: 'venstarThermostat',
      label: 'Venstar Thermostat',
      metadata: {
        alexa: {
          value: 'Thermostat'
        },
        channel: {
          value: 'venstarthermostat:thermostat:mode'
        }
      }
    },
    {
      type: 'Number',
      name: 'zwaveThermostat',
      label: 'ZWave Thermostat',
      metadata: {
        alexa: {
          value: 'Thermostat'
        },
        channel: {
          value: 'zwave:thermostat:mode'
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
    ],
    '@Value.Default': [
      {
        text: 'Default',
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
  settings: {
    regional: {
      language: 'en',
      measurementSystem: 'US',
      region: 'US'
    },
    runtime: {
      version: '2'
    }
  },
  expected: {
    gThermostat1: {
      capabilities: [
        'Alexa.RangeController:Humidity.rangeValue',
        'Alexa.TemperatureSensor.temperature',
        'Alexa.ThermostatController.targetSetpoint',
        'Alexa.ThermostatController.upperSetpoint',
        'Alexa.ThermostatController.lowerSetpoint',
        'Alexa.ThermostatController.thermostatMode',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Thermostat 1',
      resources: {
        'Alexa.RangeController:Humidity': {
          friendlyNames: ['text:Humidity:en-US']
        }
      },
      configuration: {
        'Alexa.RangeController:Humidity': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        },
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['OFF', 'HEAT', 'COOL', 'AUTO', 'ECO']
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'Humidity',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.Humidity'],
            language: 'en',
            nonControllable: true,
            supportedRange: [0, 100, 1],
            unitOfMeasure: 'Percent'
          },
          item: { name: 'currentHumidity1', type: 'Number' }
        },
        {
          name: 'TemperatureSensor',
          property: 'temperature',
          parameters: { scale: 'CELSIUS' },
          item: { name: 'currentTemperature1', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'targetSetpoint',
          parameters: { scale: 'CELSIUS' },
          item: { name: 'targetTemperature1', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'upperSetpoint',
          parameters: { scale: 'CELSIUS' },
          item: { name: 'highTargetTemperature1', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'lowerSetpoint',
          parameters: { scale: 'CELSIUS' },
          item: { name: 'lowTargetTemperature1', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'thermostatMode',
          parameters: {},
          item: { name: 'thermostatMode1', type: 'String' }
        }
      ]
    },
    gThermostat2: {
      capabilities: [
        'Alexa.RangeController:Humidity.rangeValue',
        'Alexa.TemperatureSensor.temperature',
        'Alexa.ThermostatController.targetSetpoint',
        'Alexa.ThermostatController.upperSetpoint',
        'Alexa.ThermostatController.lowerSetpoint',
        'Alexa.ThermostatController.thermostatMode',
        'Alexa.ModeController:ThermostatFan.mode',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Thermostat 2',
      resources: {
        'Alexa.RangeController:Humidity': {
          friendlyNames: ['text:Humidity:en-US']
        },
        'Alexa.ModeController:ThermostatFan': {
          friendlyNames: ['asset:Alexa.DeviceName.Fan']
        }
      },
      configuration: {
        'Alexa.RangeController:Humidity': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        },
        'Alexa.ModeController:ThermostatFan': {
          ordered: false,
          supportedModes: {
            AUTO: { friendlyNames: ['text:Default:en-US'] },
            ON: { friendlyNames: ['text:On:en-US'] }
          }
        },
        'Alexa.ThermostatController': {
          supportsScheduling: true,
          supportedModes: ['HEAT', 'OFF']
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'Humidity',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.Humidity'],
            language: 'en',
            nonControllable: true,
            supportedRange: [0, 100, 1],
            unitOfMeasure: 'Percent'
          },
          item: { name: 'currentHumidity2', type: 'Dimmer' }
        },
        {
          name: 'TemperatureSensor',
          property: 'temperature',
          parameters: { scale: 'FAHRENHEIT' },
          item: { name: 'currentTemperature2', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'targetSetpoint',
          parameters: { scale: 'FAHRENHEIT' },
          item: { name: 'targetTemperature2', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'upperSetpoint',
          parameters: { scale: 'FAHRENHEIT', comfortRange: 5 },
          item: { name: 'coolingSetpoint2', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'lowerSetpoint',
          parameters: { scale: 'FAHRENHEIT', comfortRange: 5 },
          item: { name: 'heatingSetpoint2', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'upperSetpoint',
          tag: 'eco',
          parameters: { scale: 'FAHRENHEIT' },
          item: { name: 'ecoCoolingSetpoint2', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'lowerSetpoint',
          tag: 'eco',
          parameters: { scale: 'FAHRENHEIT' },
          item: { name: 'ecoHeatingSetpoint2', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'thermostatMode',
          parameters: { OFF: 'off', HEAT: 'heat', binding: 'foobar' },
          item: { name: 'thermostatMode2', type: 'String' }
        },
        {
          name: 'ThermostatController',
          property: 'thermostatHold',
          parameters: {},
          item: { name: 'thermostatHold2', type: 'Switch' }
        },
        {
          name: 'ModeController',
          instance: 'ThermostatFan',
          property: 'mode',
          parameters: {
            capabilityNames: ['@DeviceName.Fan'],
            language: 'en',
            supportedModes: { AUTO: ['@Value.Default'], ON: ['@Value.On'] }
          },
          item: { name: 'thermostatFan2', type: 'String' }
        }
      ]
    },
    gThermostat3: {
      capabilities: [
        'Alexa.ThermostatController.targetSetpoint',
        'Alexa.ThermostatController.thermostatMode',
        'Alexa.PowerController.powerState',
        'Alexa.ToggleController:ThermostatFan.toggleState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Thermostat 3',
      resources: {
        'Alexa.ToggleController:ThermostatFan': {
          friendlyNames: ['asset:Alexa.DeviceName.Fan']
        }
      },
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['OFF', 'HEAT']
        }
      },
      cookie: [
        {
          name: 'ThermostatController',
          property: 'targetSetpoint',
          parameters: { scale: 'FAHRENHEIT', setpointRange: [60, 90] },
          item: { name: 'targetTemperature3', type: 'Number' }
        },
        {
          name: 'ThermostatController',
          property: 'thermostatMode',
          parameters: {},
          item: { name: 'thermostatMode3', type: 'Switch' }
        },
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: {},
          item: { name: 'thermostatMode3', type: 'Switch' }
        },
        {
          name: 'ToggleController',
          instance: 'ThermostatFan',
          property: 'toggleState',
          parameters: {
            capabilityNames: ['@DeviceName.Fan'],
            language: 'en'
          },
          item: { name: 'thermostatFan3', type: 'Switch' }
        }
      ]
    },
    thermostat4: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Thermostat 4',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['OFF', 'HEAT', 'COOL']
        }
      }
    },
    thermostat5: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Thermostat 5',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['OFF', 'HEAT', 'COOL', 'AUTO', 'ECO']
        }
      }
    },
    thermostat6: {
      capabilities: ['Alexa.ThermostatController.targetSetpoint', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Thermostat 6',
      configuration: {
        'Alexa.ThermostatController': {}
      }
    },
    broadlinkThermostat: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Broadlink Thermostat',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['HEAT', 'AUTO']
        }
      }
    },
    daikinThermostat: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Daikin Thermostat',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['HEAT', 'COOL', 'AUTO']
        }
      }
    },
    ecobeeThermostat: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Ecobee Thermostat',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['OFF', 'HEAT', 'COOL', 'AUTO']
        }
      }
    },
    insteonThermostat: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Insteon Thermostat',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['OFF', 'HEAT', 'COOL', 'AUTO']
        }
      }
    },
    maxThermostat: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Max Thermostat',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['HEAT', 'AUTO', 'ECO']
        }
      }
    },
    nestThermostat: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Nest Thermostat',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['OFF', 'HEAT', 'COOL', 'AUTO', 'ECO']
        }
      }
    },
    radioThermostat: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Radio Thermostat',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['OFF', 'HEAT', 'COOL', 'AUTO']
        }
      }
    },
    venstarThermostat: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'Venstar Thermostat',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['OFF', 'HEAT', 'COOL', 'AUTO']
        }
      }
    },
    zwaveThermostat: {
      capabilities: ['Alexa.ThermostatController.thermostatMode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['THERMOSTAT'],
      friendlyName: 'ZWave Thermostat',
      configuration: {
        'Alexa.ThermostatController': {
          supportsScheduling: false,
          supportedModes: ['OFF', 'HEAT', 'COOL', 'AUTO']
        }
      }
    }
  }
};
