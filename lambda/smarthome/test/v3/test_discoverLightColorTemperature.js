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
  description: "color temperature enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/colorLight",
          "type": "Color",
          "name": "colorLight",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "PowerController.powerState,BrightnessController.brightness,ColorController.color"
            }
          },
          "groupNames": ["gColorLight"]
        },
        {
          "link": "https://myopenhab.org/rest/items/colorTemperature",
          "type": "Dimmer",
          "name": "colorTemperature",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ColorTemperatureController.colorTemperatureInKelvin"
            }
          },
          "groupNames": ["gColorLight"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gUnderCabinetLight",
      "type": "Group",
      "name": "gColorLight",
      "label": "Color Light",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.Light"
        }
      },
      "groupNames": []
    }
  ],
  expected: {
    "gColorLight": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness",
        "Alexa.ColorController.color",
        "Alexa.ColorTemperatureController.colorTemperatureInKelvin",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["LIGHT"],
      "friendlyName": "Color Light"
    },
  }
};
