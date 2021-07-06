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
  description: 'television',
  items: [
    {
      type: 'Group',
      name: 'gTelevision1',
      label: 'Television 1',
      metadata: {
        alexa: {
          value: 'Television'
        }
      },
      members: [
        {
          type: 'Number',
          name: 'channel1',
          metadata: {
            alexa: {
              value: 'Channel',
              config: {
                channelMappings: 'FOO=12,BAR=34,baz=56,QUX=invalid'
              }
            }
          }
        },
        {
          type: 'String',
          name: 'input1',
          metadata: {
            alexa: {
              value: 'Input',
              config: {
                supportedInputs: 'HDMI1,HDMI2'
              }
            }
          }
        }
      ]
    },
    {
      type: 'String',
      name: 'channel2',
      label: 'Television Channel 2',
      metadata: {
        alexa: {
          value: 'Channel'
        }
      }
    },
    {
      type: 'Number',
      name: 'input2',
      label: 'Television Input 2',
      metadata: {
        alexa: {
          value: 'Television.Input',
          config: {
            supportedInputs: '1=HDMI1,2=HDMI2'
          }
        }
      }
    },
    {
      type: 'String',
      name: 'input3',
      label: 'Television Input 3',
      metadata: {
        alexa: {
          value: 'Television.Input',
          config: {
            supportedInputs: 'HDMI1=Cable,HDMI2=Kodi'
          }
        }
      }
    },
    {
      type: 'String',
      name: 'input4',
      label: 'Television Input 4',
      metadata: {
        alexa: {
          value: 'InputController.input', // backward compatibility
          config: {
            supportedInputs: 'HDMI1,HDMI2,FOOBAR'
          }
        }
      }
    },
    {
      type: 'String',
      name: 'input99',
      label: 'Television Input Invalid',
      metadata: {
        alexa: {
          value: 'InputController.input' // backward compatibility
        }
      }
    }
  ],
  catalog: {
    '@Setting.Input': [
      {
        text: 'Input',
        locale: 'en-US'
      }
    ]
  },
  expected: {
    gTelevision1: {
      capabilities: [
        'Alexa.ChannelController.channel',
        'Alexa.ModeController:Input.mode',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['TV'],
      friendlyName: 'Television 1',
      propertyFlags: {
        'Alexa.ModeController:Input': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ModeController:Input': {
          friendlyNames: ['text:Input:en-US']
        }
      },
      configuration: {
        'Alexa.ModeController:Input': {
          ordered: false,
          supportedModes: {
            HDMI1: {
              friendlyNames: [
                'text:HDMI1:en-AU',
                'text:HDMI1:en-CA',
                'text:HDMI1:en-GB',
                'text:HDMI1:en-IN',
                'text:HDMI1:en-US'
              ]
            },
            HDMI2: {
              friendlyNames: [
                'text:HDMI2:en-AU',
                'text:HDMI2:en-CA',
                'text:HDMI2:en-GB',
                'text:HDMI2:en-IN',
                'text:HDMI2:en-US'
              ]
            }
          }
        }
      },
      cookie: [
        {
          name: 'ChannelController',
          property: 'channel',
          parameters: {
            channelMappings: { FOO: '12', BAR: '34', BAZ: '56' }
          },
          item: { name: 'channel1', type: 'Number' }
        },
        {
          name: 'ModeController',
          instance: 'Input',
          property: 'mode',
          parameters: {
            capabilityNames: ['@Setting.Input'],
            supportedModes: { HDMI1: ['HDMI1'], HDMI2: ['HDMI2'] }
          },
          item: { name: 'input1', type: 'String' }
        }
      ]
    },
    channel2: {
      capabilities: ['Alexa.ChannelController.channel', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['TV'],
      friendlyName: 'Television Channel 2'
    },
    input2: {
      capabilities: ['Alexa.ModeController:Input.mode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['TV'],
      friendlyName: 'Television Input 2',
      configuration: {
        'Alexa.ModeController:Input': {
          ordered: false,
          supportedModes: {
            1: {
              friendlyNames: [
                'text:HDMI1:en-AU',
                'text:HDMI1:en-CA',
                'text:HDMI1:en-GB',
                'text:HDMI1:en-IN',
                'text:HDMI1:en-US'
              ]
            },
            2: {
              friendlyNames: [
                'text:HDMI2:en-AU',
                'text:HDMI2:en-CA',
                'text:HDMI2:en-GB',
                'text:HDMI2:en-IN',
                'text:HDMI2:en-US'
              ]
            }
          }
        }
      }
    },
    input3: {
      capabilities: ['Alexa.ModeController:Input.mode', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['TV'],
      friendlyName: 'Television Input 3',
      configuration: {
        'Alexa.ModeController:Input': {
          ordered: false,
          supportedModes: {
            HDMI1: {
              friendlyNames: [
                'text:Cable:en-AU',
                'text:Cable:en-CA',
                'text:Cable:en-GB',
                'text:Cable:en-IN',
                'text:Cable:en-US'
              ]
            },
            HDMI2: {
              friendlyNames: [
                'text:Kodi:en-AU',
                'text:Kodi:en-CA',
                'text:Kodi:en-GB',
                'text:Kodi:en-IN',
                'text:Kodi:en-US'
              ]
            }
          }
        }
      }
    },
    input4: {
      capabilities: ['Alexa.InputController.input', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['TV'],
      friendlyName: 'Television Input 4',
      parameters: {
        'Alexa.InputController.inputs': [{ name: 'HDMI 1' }, { name: 'HDMI 2' }]
      }
    }
  }
};
