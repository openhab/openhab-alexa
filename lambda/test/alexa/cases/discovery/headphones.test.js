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
  description: 'headphones',
  items: [
    {
      type: 'Group',
      name: 'gHeadphones1',
      label: 'Headphones 1',
      metadata: {
        alexa: {
          value: 'Headphones'
        }
      }
    },
    {
      type: 'Player',
      name: 'playback',
      groupNames: ['gHeadphones1'],
      metadata: {
        alexa: {
          value: 'Playback'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'volume',
      groupNames: ['gHeadphones1'],
      metadata: {
        alexa: {
          value: 'VolumeLevel'
        }
      }
    },
    {
      type: 'Switch',
      name: 'headphones2',
      label: 'Headphones 2',
      metadata: {
        alexa: {
          value: 'Headphones',
          config: {
            retrievable: false
          }
        }
      }
    }
  ],
  expected: {
    gHeadphones1: {
      capabilities: ['Alexa.PlaybackController', 'Alexa.Speaker.volume', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['HEADPHONES'],
      friendlyName: 'Headphones 1'
    },
    headphones2: {
      capabilities: ['Alexa.PowerController', 'Alexa'],
      displayCategories: ['HEADPHONES'],
      friendlyName: 'Headphones 2'
    }
  }
};
