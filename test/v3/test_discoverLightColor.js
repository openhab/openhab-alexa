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
    }
  ],
  expected: {
    "light1": {
      "capabilities": [
        "Alexa",
        "Alexa.PowerController.powerState",
        "Alexa.BrightnessController.brightness",
        "Alexa.ColorController.color"
      ],
      "displayCategories": ["LIGHT", "SWITCH"],
      "friendlyName": "Color Light 1"
    }
  }
};
