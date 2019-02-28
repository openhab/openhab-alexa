module.exports = {
  description: "single color light",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/light1",
      "type": "Color",
      "name": "light1",
      "label": "Color Light 1",
      "category": "lightbulb",
      "tags": ["Lighting"]
    },
    {
      "link": "https://localhost:8443/rest/items/light2",
      "type": "Color",
      "name": "light2",
      "label": "Color Light 2",
      "category": "lightbulb",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Lighting"
        }
      }
    },
    {
      "link": "https://localhost:8443/rest/items/light3",
      "type": "Color",
      "name": "light3",
      "label": "Color Light 3",
      "category": "lightbulb",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "PowerController.powerState,BrightnessController.brightness,ColorController.color",
          "config": {
            "category": "Color" // Invalid category (fallback to default capabilities categories)
          }
        }
      }
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
