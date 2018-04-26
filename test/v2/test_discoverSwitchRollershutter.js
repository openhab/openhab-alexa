module.exports = {
  description: "single roller shutter switch",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/switch1",
      "type": "Rollershutter",
      "name": "switch1",
      "label": "Roller Shutter",
      "category": "rollershutter",
      "tags": ["Switchable"]
    }
  ],
  expected: {
    "switch1": {
      "actions": [
        "setPercentage",
        "incrementPercentage",
        "decrementPercentage"
      ],
      "applianceTypes": ["SWITCH"],
      "friendlyName": "Roller Shutter"
    }
  }
};
