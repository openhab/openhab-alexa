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
  description: 'light',
  items: [
    {
      type: 'Color',
      name: 'light1',
      label: 'Color Light 1',
      tags: ['Lighting']
    },
    {
      type: 'Color',
      name: 'light2',
      label: 'Color Light 2',
      metadata: {
        alexa: {
          value: 'Lighting'
        }
      }
    },
    {
      type: 'Color',
      name: 'light3',
      label: 'Non-Relevant Label',
      metadata: {
        alexa: {
          value: 'Light',
          config: {
            name: 'Color Light 3',
            description: 'Smart Color Light'
          }
        }
      }
    },
    {
      type: 'Color',
      name: 'light4',
      label: 'Color Light 4',
      metadata: {
        alexa: {
          value: 'PowerState,Brightness,Color,Invalid',
          config: {
            category: 'Color' // Invalid category (fallback to default capabilities categories)
          }
        },
        autoupdate: {
          value: 'false'
        }
      }
    },
    {
      type: 'Color',
      name: 'light5',
      label: 'Color Light 5',
      metadata: {
        alexa: {
          value: 'Light.PowerState,Light.Brightness,Light.Color,Light.PowerLevel',
          config: {
            retrievable: false
          }
        }
      }
    },
    {
      type: 'Group',
      name: 'gLight6',
      label: 'Color Light 6',
      metadata: {
        alexa: {
          value: 'Light'
        }
      }
    },
    {
      type: 'Color',
      name: 'light6',
      groupNames: ['gLight6'],
      metadata: {
        alexa: {
          value: 'Light'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'colorTemperature6',
      groupNames: ['gLight6'],
      metadata: {
        alexa: {
          value: 'ColorTemperature'
        },
        channel: {
          value: 'hue:bulb:brightness'
        }
      }
    },
    {
      type: 'Switch',
      name: 'connectivity6',
      groupNames: ['gLight6'],
      metadata: {
        alexa: {
          value: 'EndpointHealth.connectivity' // Not configurable capability
        }
      }
    },
    {
      groupType: 'Switch',
      type: 'Group',
      name: 'gLight7',
      label: 'Light Group 7',
      metadata: {
        alexa: {
          value: 'Light'
        }
      }
    },
    {
      type: 'Dimmer',
      name: 'light8',
      label: 'Dimmer Light 8',
      groupNames: ['gLight7'],
      metadata: {
        alexa: {
          value: 'Light'
        }
      }
    },
    {
      type: 'Color',
      name: 'light9',
      label: 'Color Light 9',
      groupNames: ['gLight7'],
      metadata: {
        alexa: {
          value: 'Light'
        }
      }
    },
    {
      type: 'Switch',
      name: 'light10',
      label: 'Light Switch 10',
      metadata: {
        alexa: {
          value: 'PowerController.powerState',
          config: {
            category: 'LIGHT'
          }
        }
      }
    },
    {
      type: 'Number',
      name: 'colorTemperature10',
      label: 'Color Temperature 10',
      metadata: {
        alexa: {
          value: 'ColorTemperature',
          config: {
            range: '2500:9000'
          }
        }
      }
    },
    {
      type: 'Color',
      name: 'light99',
      label: '', // Item skipped because no label or synonyms metadata value
      metadata: {
        alexa: {
          value: 'Light'
        }
      }
    },
    {
      type: 'Group',
      name: 'gLight99',
      label: 'Light Group',
      metadata: {
        alexa: {
          value: 'Light' // Invalid endpoint (group with no capabilities)
        }
      }
    }
  ],
  settings: {
    runtime: {
      uuid: '00000000-0000-0000-0000-000000000000',
      version: '2'
    }
  },
  expected: {
    light1: {
      capabilities: [
        'Alexa.PowerController.powerState',
        'Alexa.BrightnessController.brightness',
        'Alexa.ColorController.color',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['LIGHT'],
      friendlyName: 'Color Light 1'
    },
    light2: {
      capabilities: [
        'Alexa.PowerController.powerState',
        'Alexa.BrightnessController.brightness',
        'Alexa.ColorController.color',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['LIGHT'],
      friendlyName: 'Color Light 2'
    },
    light3: {
      capabilities: [
        'Alexa.PowerController.powerState',
        'Alexa.BrightnessController.brightness',
        'Alexa.ColorController.color',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['LIGHT'],
      friendlyName: 'Color Light 3',
      description: 'Smart Color Light via openHAB',
      additionalAttributes: {
        manufacturer: 'openHAB',
        model: 'Color light3',
        softwareVersion: '2',
        customIdentifier: 'ca60d77f-479a-5fb4-9586-38d5adb736de'
      }
    },
    light4: {
      capabilities: ['Alexa.PowerController', 'Alexa.BrightnessController', 'Alexa.ColorController', 'Alexa'],
      displayCategories: ['SWITCH', 'LIGHT'],
      friendlyName: 'Color Light 4',
      propertyFlags: {}, // no property flags expected
      cookie: [
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: { retrievable: false },
          item: { name: 'light4', type: 'Color' }
        },
        {
          name: 'BrightnessController',
          property: 'brightness',
          parameters: { retrievable: false },
          item: { name: 'light4', type: 'Color' }
        },
        {
          name: 'ColorController',
          property: 'color',
          parameters: { retrievable: false },
          item: { name: 'light4', type: 'Color' }
        }
      ]
    },
    light5: {
      capabilities: ['Alexa.PowerController', 'Alexa.BrightnessController', 'Alexa.ColorController', 'Alexa'],
      displayCategories: ['LIGHT'],
      friendlyName: 'Color Light 5',
      propertyFlags: {}, // no property flags expected
      cookie: [
        {
          name: 'PowerController',
          property: 'powerState',
          parameters: { retrievable: false },
          item: { name: 'light5', type: 'Color' }
        },
        {
          name: 'BrightnessController',
          property: 'brightness',
          parameters: { retrievable: false },
          item: { name: 'light5', type: 'Color' }
        },
        {
          name: 'ColorController',
          property: 'color',
          parameters: { retrievable: false },
          item: { name: 'light5', type: 'Color' }
        }
      ]
    },
    gLight6: {
      capabilities: [
        'Alexa.PowerController.powerState',
        'Alexa.BrightnessController.brightness',
        'Alexa.ColorController.color',
        'Alexa.ColorTemperatureController.colorTemperatureInKelvin',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['LIGHT'],
      friendlyName: 'Color Light 6',
      cookie: [
        {
          name: 'ColorTemperatureController',
          property: 'colorTemperatureInKelvin',
          parameters: { binding: 'hue:bulb' },
          item: { name: 'colorTemperature6', type: 'Dimmer' }
        },
        {
          name: 'EndpointHealth',
          property: 'connectivity',
          parameters: {}
        }
      ]
    },
    gLight7: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['LIGHT'],
      friendlyName: 'Light Group 7'
    },
    light8: {
      capabilities: [
        'Alexa.PowerController.powerState',
        'Alexa.BrightnessController.brightness',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['LIGHT'],
      friendlyName: 'Dimmer Light 8'
    },
    light9: {
      capabilities: [
        'Alexa.PowerController.powerState',
        'Alexa.BrightnessController.brightness',
        'Alexa.ColorController.color',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['LIGHT'],
      friendlyName: 'Color Light 9'
    },
    light10: {
      capabilities: ['Alexa.PowerController.powerState', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['LIGHT'],
      friendlyName: 'Light Switch 10'
    },
    colorTemperature10: {
      capabilities: [
        'Alexa.ColorTemperatureController.colorTemperatureInKelvin',
        'Alexa.EndpointHealth.connectivity',
        'Alexa'
      ],
      displayCategories: ['LIGHT'],
      friendlyName: 'Color Temperature 10',
      cookie: [
        {
          name: 'ColorTemperatureController',
          property: 'colorTemperatureInKelvin',
          parameters: { range: [2500, 9000] },
          item: { name: 'colorTemperature10', type: 'Number' }
        }
      ]
    }
  }
};
