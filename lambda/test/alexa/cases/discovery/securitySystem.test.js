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
  description: 'security system',
  items: [
    {
      type: 'Number',
      name: 'securitySystem',
      label: 'Security System',
      metadata: {
        alexa: {
          value: 'SecuritySystem'
        }
      }
    }
  ],
  expected: {
    securitySystem: {
      capabilities: ['Alexa.SecurityPanelController.armState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SECURITY_SYSTEM'],
      friendlyName: 'Security System',
      configuration: {
        'Alexa.SecurityPanelController': {
          supportedArmStates: [
            { value: 'DISARMED' },
            { value: 'ARMED_STAY' },
            { value: 'ARMED_AWAY' },
            { value: 'ARMED_NIGHT' }
          ]
        }
      },
      cookie: [
        {
          name: 'SecurityPanelController',
          property: 'armState',
          parameters: {},
          item: { name: 'securitySystem', type: 'Number' }
        }
      ]
    }
  }
};
