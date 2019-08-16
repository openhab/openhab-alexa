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
      "type": "Dimmer",
      "name": "light1",
      "label": "Dimmer Light",
      "tags": ["Lighting"],
      "groupNames": ["lightGroup"]
    },
    {
      "type": "Color",
      "name": "light2",
      "label": "Color Light",
      "tags": ["Lighting"],
      "groupNames": ["lightGroup"]
    },
    {
      "groupType": "Switch",
      "type": "Group",
      "name": "lightGroup",
      "label": "Light Group",
      "tags": ["Lighting"],
      "groupNames": []
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
