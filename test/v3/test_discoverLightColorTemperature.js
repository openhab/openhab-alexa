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
