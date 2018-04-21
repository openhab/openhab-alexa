module.exports = [
  {
    description: "play request",
    directive: {
      "header": {
        "namespace": "Alexa.PlaybackController",
        "name": "Play"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PlaybackController": {"playback": {"parameters": {}, "itemName": "speakerPlayer"}}
          })
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": []
          },
          "event": {
            "header": {
              "namespace":"Alexa",
              "name": "Response"
            },
          }
        }
      },
      "openhab": {
        "commands": [{"name": "speakerPlayer", "value": "PLAY"}],
        "input": {"staged": false, "values": {"name": "speakerPlayer", "state": "PLAY", "type": "Player"}}
      }
    }
  }
];
