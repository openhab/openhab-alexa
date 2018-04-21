module.exports = {
  description: "television enabled group",
  input: {
    "staged": false,
    "values" : [
      {
        "members": [
          {
            "link": "https://myopenhab.org/rest/items/televisionChannel",
            "type": "Number",
            "name": "televisionChannel",
            "tags": [
              "Alexa.ChannelController.channel"
            ],
            "groupNames": ["gTelevision"]
          },
          {
            "link": "https://myopenhab.org/rest/items/televisionSource",
            "type": "String",
            "name": "televisionSource",
            "tags": [
              "Alexa.InputController.input"
            ],
            "groupNames": ["gTelevision"]
          }
        ],
        "link": "https://myopenhab.org/rest/items/gTelevision",
        "type": "Group",
        "name": "gTelevision",
        "tags": [
          "Alexa.Endpoint.TV"
        ],
        "groupNames": []
      }
    ]
  },
  expected: {
    "gTelevision": {
      "capabilities": [
        "Alexa",
        "Alexa.ChannelController.channel",
        "Alexa.InputController.input"
      ],
      "displayCategories": ["TV"]
    }
  }
};
