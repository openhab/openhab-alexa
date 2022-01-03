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
  description: 'switch',
  items: [
    {
      type: 'Dimmer',
      name: 'switch1',
      label: 'Dimmer Switch 1',
      metadata: {
        alexa: {
          value: 'Switch'
        }
      }
    },
    {
      type: 'Rollershutter',
      name: 'switch2',
      label: 'Roller Shutter Switch 2',
      metadata: {
        alexa: {
          value: 'Switch'
        }
      }
    },
    {
      type: 'Switch',
      name: 'switch3',
      label: 'Switch 3',
      metadata: {
        alexa: {
          value: 'Switch'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'switch4',
      label: 'Dimmer Switch Power 4',
      metadata: {
        alexa: {
          value: 'PowerState'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'switch5',
      label: 'Dimmer Switch Power Level 5',
      metadata: {
        alexa: {
          value: 'PowerLevel'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'switch6',
      label: 'Dimmer Switch Percentage 6',
      metadata: {
        alexa: {
          value: 'Percentage'
        }
      }
    },
    {
      type: 'Switch',
      name: 'switch99',
      label: 'Switch',
      tags: ['Switchable'] // no tag support in oh3.x
    }
  ],
  settings: {
    runtime: {
      version: '3.0.0'
    }
  },
  expected: {
    switch1: {
      capabilities: [
        'Alexa.PowerController.powerState',
        'Alexa.PowerLevelController.powerLevel',
        'Alexa.PercentageController.percentage',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['SWITCH'],
      friendlyName: 'Dimmer Switch 1'
    },
    switch2: {
      capabilities: ['Alexa.PercentageController.percentage', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SWITCH'],
      friendlyName: 'Roller Shutter Switch 2'
    },
    switch3: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SWITCH'],
      friendlyName: 'Switch 3'
    },
    switch4: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SWITCH'],
      friendlyName: 'Dimmer Switch Power 4'
    },
    switch5: {
      capabilities: ['Alexa.PowerLevelController.powerLevel', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['SWITCH'],
      friendlyName: 'Dimmer Switch Power Level 5'
    },
    switch6: {
      capabilities: ['Alexa.PercentageController.percentage', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['OTHER'],
      friendlyName: 'Dimmer Switch Percentage 6'
    }
  }
};
