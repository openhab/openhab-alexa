module.exports = {
  description: "door lock",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/doorLock",
      "type": "Switch",
      "name": "doorLock",
      "label": "Door Lock",
      "tags": ["Lock"]
    }
  ],
  expected: {
    "doorLock": {
      "actions": [
        "getLockState",
        "setLockState"
      ],
      "applianceTypes": ["SMARTLOCK"],
      "friendlyName": "Door Lock"
    }
  }
};
