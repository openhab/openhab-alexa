module.exports = {
  description: "color temperature enabled group",
  input: {
    "staged": false,
    "values": [
      {
        "members": [
          {
            "link": "https://myopenhab.org/rest/items/colorLight",
            "type": "Color",
            "name": "colorLight",
            "tags": [
              "Alexa.PowerController.powerState:category=LIGHT",
              "Alexa.BrightnessController.brightness",
              "Alexa.ColorController.color"
            ],
            "groupNames": ["gColorLight"]
          },
          {
            "link": "https://myopenhab.org/rest/items/colorTemperature",
            "type": "Dimmer",
            "name": "colorTemperature",
            "tags": [
              "Alexa.ColorTemperatureController.colorTemperatureInKelvin"
            ],
            "groupNames": ["gColorLight"]
          }
        ],
        "link": "https://myopenhab.org/rest/items/gUnderCabinetLight",
        "type": "Group",
        "name": "gColorLight",
        "tags": [
          "Alexa.Endpoint.Light"
        ],
        "groupNames": []
      }
    ]
  },
  expected: {
    "gColorLight": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness",
        "Alexa.ColorController.color",
        "Alexa.ColorTemperatureController.colorTemperatureInKelvin"
      ],
      "displayCategories": ["LIGHT"]
    },
  }
};
