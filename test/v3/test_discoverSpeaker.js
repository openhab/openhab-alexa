module.exports = {
  description: "speaker player enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/speakerMute",
          "type": "Switch",
          "name": "speakerMute",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "Speaker.muted"
            }
          },
          "groupNames": ["gSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/speakerVolume",
          "type": "Dimmer",
          "name": "speakerVolume",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "Speaker.volume"
            }
          },
          "groupNames": ["gSpeaker"]
        },
        {
          "link": "https://myopenhab.org/rest/items/speakerPlayer",
          "type": "Player",
          "name": "speakerPlayer",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "PlaybackController.playback"
            }
          },
          "groupNames": ["gSpeaker"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gSpeaker",
      "type": "Group",
      "name": "gSpeaker",
      "label": "Speaker",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.Speaker"
        }
      },
      "groupNames": []
    }
  ],
  expected: {
    "gSpeaker": {
      "capabilities": [
        "Alexa",
        "Alexa.Speaker.volume",
        "Alexa.Speaker.muted",
        "Alexa.PlaybackController"
      ],
      "displayCategories": ["SPEAKER"],
      "friendlyName": "Speaker"
    }
  }
};
