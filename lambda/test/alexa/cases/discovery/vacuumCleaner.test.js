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
  description: 'vacuum cleaner',
  items: [
    {
      type: 'Group',
      name: 'gVacuumCleaner1',
      label: 'Vacuum Cleaner 1',
      metadata: {
        alexa: {
          value: 'VacuumCleaner'
        }
      }
    },
    {
      type: 'String',
      name: 'vacuumMode1',
      groupNames: ['gVacuumCleaner1'],
      metadata: {
        alexa: {
          value: 'VacuumMode'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'fanSpeed1',
      groupNames: ['gVacuumCleaner1'],
      metadata: {
        alexa: {
          value: 'FanSpeed'
        }
      }
    },
    {
      type: 'Number',
      name: 'vacuumCleaner2',
      label: 'Vacuum Cleaner 2',
      metadata: {
        alexa: {
          value: 'VacuumCleaner'
        }
      }
    },
    {
      type: 'Number',
      name: 'vacuumCleaner3',
      label: 'Vacuum Cleaner 3',
      metadata: {
        alexa: {
          value: 'VacuumCleaner',
          config: { DOCK: 0, CLEAN: 1 }
        }
      }
    },
    {
      type: 'Number',
      name: 'vacuumCleaner99',
      label: 'Vacuum Cleaner Invalid',
      metadata: {
        alexa: {
          value: 'VacuumCleaner',
          config: { DOCK: 0, SPOT: 1 } // missing clean mode
        }
      }
    }
  ],
  catalog: {
    '@Setting.Clean': [
      {
        text: 'Clean',
        locale: 'en-US'
      }
    ],
    '@Setting.Dock': [
      {
        text: 'Dock',
        locale: 'en-US'
      }
    ],
    '@Setting.Speed': [
      {
        text: 'Speed',
        locale: 'en-US'
      }
    ],
    '@Setting.Spot': [
      {
        text: 'Spot',
        locale: 'en-US'
      }
    ],
    '@Value.Pause': [
      {
        text: 'Pause',
        locale: 'en-US'
      }
    ],
    '@Value.Stop': [
      {
        text: 'Stop',
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
    gVacuumCleaner1: {
      capabilities: [
        'Alexa.ModeController:VacuumMode.mode',
        'Alexa.PowerController.powerState',
        'Alexa.PlaybackController',
        'Alexa.RangeController:FanSpeed.rangeValue',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['VACUUM_CLEANER'],
      friendlyName: 'Vacuum Cleaner 1',
      propertyFlags: {
        'Alexa.ModeController:VacuumMode': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.RangeController:FanSpeed': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:VacuumMode': {
          friendlyNames: ['asset:Alexa.Setting.Mode']
        },
        'Alexa.RangeController:FanSpeed': {
          friendlyNames: ['text:Speed:en-US', 'asset:Alexa.Setting.FanSpeed']
        }
      },
      configuration: {
        'Alexa.ModeController:VacuumMode': {
          ordered: false,
          supportedModes: {
            CLEAN: { friendlyNames: ['text:Clean:en-US'] },
            SPOT: { friendlyNames: ['text:Spot:en-US'] },
            DOCK: { friendlyNames: ['text:Dock:en-US'] },
            PAUSE: { friendlyNames: ['text:Pause:en-US'] },
            STOP: { friendlyNames: ['text:Stop:en-US'] }
          }
        },
        'Alexa.RangeController:FanSpeed': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent',
          presets: {
            0: { friendlyNames: ['text:Off:en-US'] },
            33: { friendlyNames: ['asset:Alexa.Value.Low', 'asset:Alexa.Value.Minimum'] },
            66: { friendlyNames: ['asset:Alexa.Value.Medium'] },
            100: { friendlyNames: ['asset:Alexa.Value.High', 'asset:Alexa.Value.Maximum'] }
          }
        }
      },
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Play', 'Pause', 'Stop']
      },
      cookie: [
        {
          name: 'ModeController',
          instance: 'VacuumMode',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Mode'],
            supportedModes: {
              CLEAN: ['@Setting.Clean'],
              SPOT: ['@Setting.Spot'],
              DOCK: ['@Setting.Dock'],
              PAUSE: ['@Value.Pause'],
              STOP: ['@Value.Stop']
            }
          },
          item: { name: 'vacuumMode1', type: 'String' }
        },
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: { OFF: 'DOCK', ON: 'CLEAN' },
          item: { name: 'vacuumMode1', type: 'String' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { RESUME: 'CLEAN', PAUSE: 'PAUSE', STOP: 'STOP' },
          item: { name: 'vacuumMode1', type: 'String' }
        },
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
          item: { name: 'fanSpeed1', type: 'Dimmer' }
        }
      ]
    },
    vacuumCleaner2: {
      capabilities: [
        'Alexa.ModeController:VacuumMode.mode',
        'Alexa.PowerController.powerState',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['VACUUM_CLEANER'],
      friendlyName: 'Vacuum Cleaner 2',
      propertyFlags: {
        'Alexa.ModeController:VacuumMode': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:VacuumMode': {
          friendlyNames: ['asset:Alexa.Setting.Mode']
        }
      },
      configuration: {
        'Alexa.ModeController:VacuumMode': {
          ordered: false,
          supportedModes: {
            CLEAN: { friendlyNames: ['text:Clean:en-US'] },
            SPOT: { friendlyNames: ['text:Spot:en-US'] },
            DOCK: { friendlyNames: ['text:Dock:en-US'] },
            PAUSE: { friendlyNames: ['text:Pause:en-US'] },
            STOP: { friendlyNames: ['text:Stop:en-US'] }
          }
        }
      },
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Play', 'Pause', 'Stop']
      },
      cookie: [
        {
          name: 'ModeController',
          instance: 'VacuumMode',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Mode'],
            supportedModes: {
              CLEAN: ['@Setting.Clean'],
              SPOT: ['@Setting.Spot'],
              DOCK: ['@Setting.Dock'],
              PAUSE: ['@Value.Pause'],
              STOP: ['@Value.Stop']
            },
            CLEAN: 1,
            DOCK: 2,
            SPOT: 3,
            PAUSE: 4,
            STOP: 5
          },
          item: { name: 'vacuumCleaner2', type: 'Number' }
        },
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: { OFF: 2, ON: 1 },
          item: { name: 'vacuumCleaner2', type: 'Number' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { RESUME: 1, PAUSE: 4, STOP: 5 },
          item: { name: 'vacuumCleaner2', type: 'Number' }
        }
      ]
    },
    vacuumCleaner3: {
      capabilities: [
        'Alexa.ModeController:VacuumMode.mode',
        'Alexa.PowerController.powerState',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['VACUUM_CLEANER'],
      friendlyName: 'Vacuum Cleaner 3',
      propertyFlags: {
        'Alexa.ModeController:VacuumMode': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:VacuumMode': {
          friendlyNames: ['asset:Alexa.Setting.Mode']
        }
      },
      configuration: {
        'Alexa.ModeController:VacuumMode': {
          ordered: false,
          supportedModes: {
            CLEAN: { friendlyNames: ['text:Clean:en-US'] },
            DOCK: { friendlyNames: ['text:Dock:en-US'] }
          }
        }
      },
      parameters: {
        'Alexa.PlaybackController.supportedOperations': ['Stop']
      },
      cookie: [
        {
          name: 'ModeController',
          instance: 'VacuumMode',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Mode'],
            supportedModes: {
              CLEAN: ['@Setting.Clean'],
              DOCK: ['@Setting.Dock']
            },
            DOCK: 0,
            CLEAN: 1
          },
          item: { name: 'vacuumCleaner3', type: 'Number' }
        },
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: { OFF: 0, ON: 1 },
          item: { name: 'vacuumCleaner3', type: 'Number' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { STOP: 0 },
          item: { name: 'vacuumCleaner3', type: 'Number' }
        }
      ]
    }
  }
};
