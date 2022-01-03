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
  description: 'router',
  items: [
    {
      type: 'Group',
      name: 'gWirelessRouter',
      label: 'Wireless Router',
      metadata: {
        alexa: {
          value: 'Router'
        }
      }
    },
    {
      type: 'Switch',
      name: 'guestNetwork',
      groupNames: ['gWirelessRouter'],
      metadata: {
        alexa: {
          value: 'ToggleState',
          config: {
            capabilityNames: '@Setting.GuestWiFi',
            actionMappings: 'Resume=ON,Pause=OFF'
          }
        }
      }
    }
  ],
  expected: {
    gWirelessRouter: {
      capabilities: [
        'Alexa.Networking.HomeNetworkController',
        'Alexa.ToggleController:guestNetwork.toggleState',
        'Alexa.PlaybackController',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['ROUTER'],
      friendlyName: 'Wireless Router',
      resources: {
        'Alexa.ToggleController:guestNetwork': {
          friendlyNames: ['asset:Alexa.Setting.GuestWiFi']
        }
      },
      cookie: [
        {
          name: 'ToggleController',
          instance: 'Toggle:guestNetwork',
          property: 'toggleState',
          parameters: {
            capabilityNames: ['@Setting.GuestWiFi']
          },
          item: { name: 'guestNetwork', type: 'Switch' }
        },
        {
          name: 'PlaybackController',
          property: 'playbackAction',
          parameters: { RESUME: 'ON', PAUSE: 'OFF' },
          item: { name: 'guestNetwork', type: 'Switch' }
        }
      ]
    }
  }
};
