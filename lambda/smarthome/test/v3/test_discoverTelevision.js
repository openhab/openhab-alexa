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
              "value": "InputController.input",
              "config": {
                "supportedInputs": "HDMI1,TV,FOOBAR"
              }
            }
          },
          "groupNames": ["gTelevision"]
        },
        {
          "link": "https://myopenhab.org/rest/items/televisionLabel",
          "type": "String",
          "name": "televisionLabel",
          "tags": [],
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
        "Alexa.InputController",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["TV"],
      "parameters": {
        "Alexa.InputController.inputs": [
          {"name": "HDMI 1"},
          {"name": "TV"}
        ]
      },
      "friendlyName": "Television"
    }
  }
};
