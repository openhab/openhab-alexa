/**
 * Copyright (c) 2010-2024 Contributors to the openHAB project
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

export default {
  description: 'computer',
  items: [
    {
      type: 'Group',
      name: 'gComputer1',
      label: 'Computer',
      metadata: {
        alexa: {
          value: 'Computer'
        }
      }
    },
    {
      type: 'Switch',
      name: 'networkAccess1',
      groupNames: ['gComputer1'],
      metadata: {
        alexa: {
          value: 'NetworkAccess'
        }
      }
    },
    {
      type: 'Switch',
      name: 'power1',
      groupNames: ['gComputer1'],
      metadata: {
        alexa: {
          value: 'PowerState'
        }
      }
    }
  ],
  catalog: {
    '@Setting.NetworkAccess': [
      {
        text: 'Network Access',
        locale: 'en-US'
      }
    ]
  },
  expected: {
    gComputer1: {
      capabilities: [
        'Alexa.ToggleController:NetworkAccess.toggleState',
        'Alexa.PowerController.powerState',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['COMPUTER'],
      friendlyName: 'Computer',
      propertyFlags: {
        'Alexa.ToggleController:NetworkAccess': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.ToggleController:NetworkAccess': {
          friendlyNames: ['text:Network Access:en-US']
        }
      },
      cookie: [
        {
          name: 'ToggleController',
          instance: 'NetworkAccess',
          property: 'toggleState',
          parameters: {
            capabilityNames: ['@Setting.NetworkAccess']
          },
          item: { name: 'networkAccess1', type: 'Switch' }
        },
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: {},
          item: { name: 'power1', type: 'Switch' }
        }
      ]
    }
  }
};
