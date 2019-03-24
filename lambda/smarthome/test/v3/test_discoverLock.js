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
      "capabilities": [
        "Alexa",
        "Alexa.LockController.lockState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SMARTLOCK"],
      "friendlyName": "Door Lock"
    }
  }
};
