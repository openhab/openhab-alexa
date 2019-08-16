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
  description: "single color light",
  mocked: [
    {
      "type": "Color",
      "name": "light1",
      "label": "Color Light 1",
      "tags": ["Lighting"]
    },
    {
      "type": "Color",
      "name": "light2",
      "label": "Color Light 2",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Lighting"
        }
      }
    },
    {
      "type": "Color",
      "name": "light3",
      "label": "Color Light 3",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "PowerController.powerState,BrightnessController.brightness,ColorController.color",
          "config": {
            "category": "Color" // Invalid category (fallback to default capabilities categories)
          }
        }
      }
    },
    {
      "type": "Color",
      "name": "light4",
      "label": "", // Item skipped because no label or synonyms metadata value
      "tags": ["Lighting"]
    }
  ],
  expected: {
    "light1": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness",
        "Alexa.ColorController.color",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["LIGHT"],
      "friendlyName": "Color Light 1"
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
      "friendlyName": "Color Light 2"
    },
    "light3": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness",
        "Alexa.ColorController.color",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SWITCH", "LIGHT"],
      "friendlyName": "Color Light 3"
    }
  }
};
