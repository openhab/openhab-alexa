module.exports = {
  description: "single roller shutter switch",
  input: {
    "staged": false,
    "values" : [
      {
        "link": "https://localhost:8443/rest/items/switch1",
        "type": "Rollershutter",
        "name": "switch1",
        "category": "rollershutter",
        "tags": ["Switchable"]
      }
    ]
  },
  expected: {
    "switch1": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.PercentageController.percentage"
      ],
      "displayCategories": ["SWITCH", "OTHER"]
    }
  }
};
