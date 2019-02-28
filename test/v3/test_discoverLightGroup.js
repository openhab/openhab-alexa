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
