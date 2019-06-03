/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
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
  description: "tagged light group and its tagged children",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/light1",
      "type": "Dimmer",
      "name": "light1",
      "label": "Dimmer Light",
      "category": "lightbulb",
      "tags": ["Lighting"],
    },
    {
      "link": "https://localhost:8443/rest/items/light2",
      "type": "Color",
      "name": "light2",
      "label": "Color Light",
      "category": "lightbulb",
      "tags": ["Lighting"],
    },
    {
      "members": [
        {
          "link": "https://localhost:8443/rest/items/light1",
          "type": "Dimmer",
          "name": "light1",
          "label": "Dimmer",
          "category": "lightbulb",
          "tags": ["Lighting"],
        },
        {
          "link": "https://localhost:8443/rest/items/light2",
          "type": "Color",
          "name": "light2",
          "label": "Color Light",
          "category": "lightbulb",
          "tags": ["Lighting"],
        }
      ],
      "groupType": "Switch",
      "function": {
      "name": "OR",
      "params": ["ON","OFF"]
    },
    "link": "https://localhost:8443/rest/items/lightGroup",
    "type": "Group",
    "name": "lightGroup",
    "label": "Light Group",
    "category": "switch",
    "tags": ["Lighting"],
    }
  ],
  expected: {
    "light1": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["LIGHT"],
      "friendlyName": "Dimmer Light"
    },
    "light2": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness",
        "Alexa.ColorController.color",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["LIGHT"],
      "friendlyName": "Color Light"
    },
    "lightGroup": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["LIGHT"],
      "friendlyName": "Light Group"
    }
  }
};
