module.exports = {
  description: "speaker player enabled group",
  input: {
    "staged": false,
    "values" : [
      {
        "members": [
          {
            "link": "https://myopenhab.org/rest/items/speakerMute",
            "type": "Switch",
            "name": "speakerMute",
            "tags": [
              "Alexa.Speaker.muted"
            ],
            "groupNames": ["gSpeaker"]
          },
          {
            "link": "https://myopenhab.org/rest/items/speakerVolume",
            "type": "Dimmer",
            "name": "speakerVolume",
            "tags": [
              "Alexa.Speaker.volume"
            ],
            "groupNames": ["gSpeaker"]
          },
          {
            "link": "https://myopenhab.org/rest/items/speakerPlayer",
            "type": "Player",
            "name": "speakerPlayer",
            "tags": [
              "Alexa.PlaybackController.playback"
            ],
            "groupNames": ["gSpeaker"]
          }
        ],
        "link": "https://myopenhab.org/rest/items/gSpeaker",
        "type": "Group",
        "name": "gSpeaker",
        "tags": [
          "Alexa.Endpoint.Speaker"
        ],
        "groupNames": []
      }
    ]
  },
  expected: {
    "gSpeaker": {
      "capabilities": [
        "Alexa",
        "Alexa.Speaker.volume",
        "Alexa.Speaker.muted",
        "Alexa.PlaybackController"
      ],
      "displayCategories": ["SPEAKER", "OTHER"]
    }
  }
};
