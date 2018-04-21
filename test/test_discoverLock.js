module.exports = {
  description: "door lock",
  input: {
    "staged": false,
    "values" : [
      {
        "link": "https://localhost:8443/rest/items/doorLock",
        "type": "Switch",
        "name": "doorLock",
        "tags": ["Lock"]
      }
    ]
  },
  expected: {
    "light1": {
      "capabilities": [
        "Alexa",
        "Alexa.LockController.lockState"
      ],
      "displayCategories": ["LOCK"]
    }
  }
};
