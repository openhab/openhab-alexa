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
      type: 'Number',
      name: 'channel1',
      metadata: {
        alexa: {
          value: 'Channel',
          config: {
            channelMappings: 'FOO=12,BAR=34,baz=56,QUX=invalid'
          }
        }
      },
      groupNames: ['gTelevision1']
    },
    {
      type: 'String',
      name: 'input1',
      metadata: {
        alexa: {
          value: 'Input',
          config: {
            supportedInputs: 'HDMI1,TV,FOOBAR'
          }
        }
      },
      groupNames: ['gTelevision1']
    },
    {
      type: 'Group',
      name: 'gTelevision1',
      label: 'Television 1',
      metadata: {
        alexa: {
          value: 'Television'
        }
      }
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
      type: 'String',
      name: 'input2',
      label: 'Television Input 2',
      metadata: {
        alexa: {
          value: 'Input',
          config: {
            supportedInputs: 'HDMI 1,HDMI 2'
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
          value: 'Input'
        }
      }
    }
  ],
  expected: {
    gTelevision1: {
      capabilities: [
        'Alexa.ChannelController.channel',
        'Alexa.InputController.input',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['TV'],
      friendlyName: 'Television 1',
      parameters: {
        'Alexa.InputController.inputs': [{ name: 'HDMI 1' }, { name: 'TV' }]
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
          name: 'InputController',
          property: 'input',
          parameters: {
            supportedInputs: ['HDMI 1', 'TV']
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
      capabilities: ['Alexa.InputController.input', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['TV'],
      friendlyName: 'Television Input 2',
      parameters: {
        'Alexa.InputController.inputs': [{ name: 'HDMI 1' }, { name: 'HDMI 2' }]
      }
    }
  }
};
