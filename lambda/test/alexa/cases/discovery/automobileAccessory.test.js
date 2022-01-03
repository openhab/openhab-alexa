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
  description: 'automobile accessory',
  items: [
    {
      type: 'Group',
      name: 'gDashCamera',
      label: 'Dash Camera',
      metadata: {
        alexa: {
          value: 'AutomobileAccessory'
        }
      }
    },
    {
      type: 'Number',
      name: 'batteryLevel',
      groupNames: ['gDashCamera'],
      metadata: {
        alexa: {
          value: 'BatteryLevel'
        }
      }
    },
    {
      type: 'String',
      name: 'cameraStream',
      groupNames: ['gDashCamera'],
      metadata: {
        alexa: {
          value: 'CameraStream',
          config: {
            proxyBaseUrl: 'https://openhab.myserver.tld'
          }
        }
      }
    },
    {
      type: 'Switch',
      name: 'power',
      groupNames: ['gDashCamera'],
      metadata: {
        alexa: {
          value: 'PowerState'
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
    gDashCamera: {
      capabilities: [
        'Alexa.RangeController:BatteryLevel.rangeValue',
        'Alexa.CameraStreamController',
        'Alexa.PowerController.powerState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['AUTO_ACCESSORY'],
      friendlyName: 'Dash Camera',
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
      parameters: {
        'Alexa.CameraStreamController.cameraStreamConfigurations': [
          {
            protocols: ['HLS'],
            resolutions: [{ width: 1920, height: 1080 }],
            authorizationTypes: ['NONE'],
            videoCodecs: ['H264'],
            audioCodecs: ['AAC']
          }
        ]
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
          item: { name: 'batteryLevel', type: 'Number' }
        },
        {
          name: 'CameraStreamController',
          property: 'cameraStream',
          parameters: {
            proxyBaseUrl: 'https://openhab.myserver.tld'
          },
          item: { name: 'cameraStream', type: 'String' }
        },
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: {},
          item: { name: 'power', type: 'Switch' }
        }
      ]
    }
  }
};
