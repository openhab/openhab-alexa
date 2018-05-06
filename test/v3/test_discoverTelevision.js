module.exports = {
  description: "television enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/televisionChannel",
          "type": "Number",
          "name": "televisionChannel",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ChannelController.channel"
            }
          },
          "groupNames": ["gTelevision"]
        },
        {
          "link": "https://myopenhab.org/rest/items/televisionSource",
          "type": "String",
          "name": "televisionSource",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "InputController.input"
            }
          },
          "groupNames": ["gTelevision"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gTelevision",
      "type": "Group",
      "name": "gTelevision",
      "label": "Television",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.TV"
        }
      },
      "groupNames": []
    }
  ],
  expected: {
    "gTelevision": {
      "capabilities": [
        "Alexa",
        "Alexa.ChannelController.channel",
        "Alexa.InputController.input"
      ],
      "displayCategories": ["TV"],
      "friendlyName": "Television"
    }
  }
};
