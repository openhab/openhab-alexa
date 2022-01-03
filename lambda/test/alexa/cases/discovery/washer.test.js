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
  description: 'washer',
  items: [
    {
      type: 'Group',
      name: 'gWasher',
      label: 'Washer',
      metadata: {
        alexa: {
          value: 'Washer'
        }
      }
    },
    {
      type: 'String',
      name: 'WashCycle',
      groupNames: ['gWasher'],
      metadata: {
        alexa: {
          value: 'Mode',
          config: {
            capabilityNames: 'Wash Cycle,Wash Setting',
            supportedModes: 'Normal=:Cottons,Delicate=@Value.Delicate:Knits:Cottons,Whites'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'WashTemperature',
      groupNames: ['gWasher'],
      metadata: {
        alexa: {
          value: 'Mode',
          config: {
            capabilityNames: 'Wash Temperature,@Setting.WaterTemperature',
            supportedModes: '0=Cold:Cool,1=Warm,2=Hot',
            ordered: true
          }
        }
      }
    },
    {
      type: 'String',
      name: 'WashSpinSpeed',
      label: 'Wash Spin Speed',
      groupNames: ['gWasher'],
      stateDescription: {
        options: [
          { value: 'off', label: 'No Spin' },
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' }
        ]
      },
      metadata: {
        alexa: {
          value: 'Mode'
        }
      }
    },
    {
      type: 'String',
      name: 'WashStatus',
      groupNames: ['gWasher'],
      metadata: {
        alexa: {
          value: 'Mode',
          config: {
            capabilityNames: 'État de Lavage',
            supportedModes: 'Washing=Lavage,Rinsing=Rincage,Spinning=Essorage',
            nonControllable: true,
            language: 'fr'
          }
        }
      }
    },
    {
      // No capability name because no item label
      type: 'String',
      name: 'InvalidMode1',
      groupNames: ['gWasher'],
      metadata: {
        alexa: {
          value: 'Mode',
          config: {
            supportedModes: 'FOO,BAR'
          }
        }
      }
    },
    {
      // No capability name because invalid capability asset id
      type: 'String',
      name: 'InvalidMode2',
      groupNames: ['gWasher'],
      metadata: {
        alexa: {
          value: 'Mode',
          config: {
            capabilityNames: '@Invalid.AssetId',
            supportedModes: 'FOO,BAR'
          }
        }
      }
    },
    {
      // No capability name because reserved friendly name
      type: 'String',
      name: 'InvalidMode3',
      groupNames: ['gWasher'],
      metadata: {
        alexa: {
          value: 'Mode',
          config: {
            capabilityNames: 'Timer',
            supportedModes: 'FOO,BAR'
          }
        }
      }
    },
    {
      // Only one supported modes because invalid mode asset id
      type: 'String',
      name: 'InvalidMode4',
      groupNames: ['gWasher'],
      metadata: {
        alexa: {
          value: 'Mode',
          config: {
            capabilityNames: '@Setting.Mode',
            supportedModes: 'FOO,BAR=@Invalid.AssetId'
          }
        }
      }
    }
  ],
  settings: {
    regional: {
      language: 'en'
    }
  },
  expected: {
    gWasher: {
      capabilities: [
        'Alexa.ModeController:WashCycle.mode',
        'Alexa.ModeController:WashTemperature.mode',
        'Alexa.ModeController:WashSpinSpeed.mode',
        'Alexa.ModeController:WashStatus.mode',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['WASHER'],
      friendlyName: 'Washer',
      propertyFlags: {
        'Alexa.ModeController:WashCycle': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.ModeController:WashTemperature': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.ModeController:WashSpinSpeed': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        },
        'Alexa.ModeController:WashStatus': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: true
        }
      },
      resources: {
        'Alexa.ModeController:WashCycle': {
          friendlyNames: [
            'text:Wash Cycle:en-AU',
            'text:Wash Cycle:en-CA',
            'text:Wash Cycle:en-GB',
            'text:Wash Cycle:en-IN',
            'text:Wash Cycle:en-US',
            'text:Wash Setting:en-AU',
            'text:Wash Setting:en-CA',
            'text:Wash Setting:en-GB',
            'text:Wash Setting:en-IN',
            'text:Wash Setting:en-US'
          ]
        },
        'Alexa.ModeController:WashTemperature': {
          friendlyNames: [
            'text:Wash Temperature:en-AU',
            'text:Wash Temperature:en-CA',
            'text:Wash Temperature:en-GB',
            'text:Wash Temperature:en-IN',
            'text:Wash Temperature:en-US',
            'asset:Alexa.Setting.WaterTemperature'
          ]
        },
        'Alexa.ModeController:WashSpinSpeed': {
          friendlyNames: [
            'text:Wash Spin Speed:en-AU',
            'text:Wash Spin Speed:en-CA',
            'text:Wash Spin Speed:en-GB',
            'text:Wash Spin Speed:en-IN',
            'text:Wash Spin Speed:en-US'
          ]
        },
        'Alexa.ModeController:WashStatus': {
          friendlyNames: ['text:État de Lavage:fr-CA', 'text:État de Lavage:fr-FR']
        }
      },
      configuration: {
        'Alexa.ModeController:WashCycle': {
          ordered: false,
          supportedModes: {
            Normal: {
              friendlyNames: [
                'text:Normal:en-AU',
                'text:Normal:en-CA',
                'text:Normal:en-GB',
                'text:Normal:en-IN',
                'text:Normal:en-US',
                'text:Cottons:en-AU',
                'text:Cottons:en-CA',
                'text:Cottons:en-GB',
                'text:Cottons:en-IN',
                'text:Cottons:en-US'
              ]
            },
            Delicate: {
              friendlyNames: [
                'asset:Alexa.Value.Delicate',
                'text:Knits:en-AU',
                'text:Knits:en-CA',
                'text:Knits:en-GB',
                'text:Knits:en-IN',
                'text:Knits:en-US'
              ]
            },
            Whites: {
              friendlyNames: [
                'text:Whites:en-AU',
                'text:Whites:en-CA',
                'text:Whites:en-GB',
                'text:Whites:en-IN',
                'text:Whites:en-US'
              ]
            }
          }
        },
        'Alexa.ModeController:WashTemperature': {
          ordered: true,
          supportedModes: {
            0: {
              friendlyNames: [
                'text:Cold:en-AU',
                'text:Cold:en-CA',
                'text:Cold:en-GB',
                'text:Cold:en-IN',
                'text:Cold:en-US',
                'text:Cool:en-AU',
                'text:Cool:en-CA',
                'text:Cool:en-GB',
                'text:Cool:en-IN',
                'text:Cool:en-US'
              ]
            },
            1: {
              friendlyNames: [
                'text:Warm:en-AU',
                'text:Warm:en-CA',
                'text:Warm:en-GB',
                'text:Warm:en-IN',
                'text:Warm:en-US'
              ]
            },
            2: {
              friendlyNames: ['text:Hot:en-AU', 'text:Hot:en-CA', 'text:Hot:en-GB', 'text:Hot:en-IN', 'text:Hot:en-US']
            }
          }
        },
        'Alexa.ModeController:WashSpinSpeed': {
          ordered: false,
          supportedModes: {
            off: {
              friendlyNames: [
                'text:No Spin:en-AU',
                'text:No Spin:en-CA',
                'text:No Spin:en-GB',
                'text:No Spin:en-IN',
                'text:No Spin:en-US'
              ]
            },
            low: {
              friendlyNames: ['text:Low:en-AU', 'text:Low:en-CA', 'text:Low:en-GB', 'text:Low:en-IN', 'text:Low:en-US']
            },
            medium: {
              friendlyNames: [
                'text:Medium:en-AU',
                'text:Medium:en-CA',
                'text:Medium:en-GB',
                'text:Medium:en-IN',
                'text:Medium:en-US'
              ]
            },
            high: {
              friendlyNames: [
                'text:High:en-AU',
                'text:High:en-CA',
                'text:High:en-GB',
                'text:High:en-IN',
                'text:High:en-US'
              ]
            }
          }
        },
        'Alexa.ModeController:WashStatus': {
          ordered: false,
          supportedModes: {
            Washing: {
              friendlyNames: ['text:Lavage:fr-CA', 'text:Lavage:fr-FR']
            },
            Rinsing: {
              friendlyNames: ['text:Rincage:fr-CA', 'text:Rincage:fr-FR']
            },
            Spinning: {
              friendlyNames: ['text:Essorage:fr-CA', 'text:Essorage:fr-FR']
            }
          }
        }
      },
      cookie: [
        {
          name: 'ModeController',
          instance: 'Mode:WashCycle',
          property: 'mode',
          parameters: {
            capabilityNames: ['Wash Cycle', 'Wash Setting'],
            supportedModes: {
              Normal: ['Normal', 'Cottons'],
              Delicate: ['@Value.Delicate', 'Knits'],
              Whites: ['Whites']
            },
            language: 'en'
          },
          item: { name: 'WashCycle', type: 'String' }
        },
        {
          name: 'ModeController',
          instance: 'Mode:WashTemperature',
          property: 'mode',
          parameters: {
            capabilityNames: ['Wash Temperature', '@Setting.WaterTemperature'],
            supportedModes: {
              0: ['Cold', 'Cool'],
              1: ['Warm'],
              2: ['Hot']
            },
            ordered: true,
            language: 'en'
          },
          item: { name: 'WashTemperature', type: 'Number' }
        },
        {
          name: 'ModeController',
          instance: 'Mode:WashSpinSpeed',
          property: 'mode',
          parameters: {
            capabilityNames: ['Wash Spin Speed'],
            supportedModes: {
              off: ['No Spin'],
              low: ['Low'],
              medium: ['Medium'],
              high: ['High']
            },
            language: 'en'
          },
          item: { name: 'WashSpinSpeed', type: 'String' }
        },
        {
          name: 'ModeController',
          instance: 'Mode:WashStatus',
          property: 'mode',
          parameters: {
            capabilityNames: ['État de Lavage'],
            supportedModes: {
              Washing: ['Lavage'],
              Rinsing: ['Rincage'],
              Spinning: ['Essorage']
            },
            nonControllable: true,
            language: 'fr'
          },
          item: { name: 'WashStatus', type: 'String' }
        }
      ]
    }
  }
};
