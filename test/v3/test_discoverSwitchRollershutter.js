module.exports = {
  description: "single roller shutter switch",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/switch1",
      "type": "Rollershutter",
      "name": "switch1",
      "label": "Roller Shutter 1",
      "category": "rollershutter",
      "tags": ["Switchable"]
    },
    {
      "link": "https://localhost:8443/rest/items/switch2",
      "type": "Rollershutter",
      "name": "switch2",
      "label": "Roller Shutter 2",
      "category": "rollershutter",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Switchable",
          "config": {
            "category": "other"
          }
        }
      }
    }
  ],
  expected: {
    "switch1": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.PercentageController.percentage",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SWITCH"],
      "friendlyName": "Roller Shutter 1"
    },
    "switch2": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.PercentageController.percentage",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["OTHER"],
      "friendlyName": "Roller Shutter 2"
    }
  }
};
