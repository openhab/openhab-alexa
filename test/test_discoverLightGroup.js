module.exports = {
  description: "tagged light group and its tagged children",
  input: {
    "staged": false,
    "values" : [
      {
        "link": "https://localhost:8443/rest/items/light1",
        "type": "Color",
        "name": "light1",
        "category": "lightbulb",
        "tags": ["Lighting"],
      },
      {
        "link": "https://localhost:8443/rest/items/light2",
        "type": "Color",
        "name": "light2",
        "category": "lightbulb",
        "tags": ["Lighting"],
      },
      {
        "members": [
          {
            "link": "https://localhost:8443/rest/items/light1",
            "type": "Color",
            "name": "light1",
            "category": "lightbulb",
            "tags": ["Lighting"],
          },
          {
            "link": "https://localhost:8443/rest/items/light2",
            "type": "Color",
            "name": "light2",
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
      "category": "switch",
      "tags": ["Lighting"],
      }
    ]
  },
  expected: {
    "light1": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness",
        "Alexa.ColorController.color"
      ],
      "displayCategories": ["LIGHT", "SWITCH"]
    },
    "light2": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness",
        "Alexa.ColorController.color"
      ],
      "displayCategories": ["LIGHT", "SWITCH"]
    },
    "lightGroup": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState"
      ],
      "displayCategories": ["SWITCH"]
    }
  }
};
