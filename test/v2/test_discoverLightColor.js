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
      "actions": [
        "incrementPercentage",
        "decrementPercentage",
        "setPercentage",
        "turnOn",
        "turnOff",
        "setColor"
      ],
      "applianceTypes": ["LIGHT"],
      "friendlyName": "Color Light 1"
    }
  }
};
