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
            "PlaybackController": {
              "playbackState": {
                "parameters": {}, "item": {"name": "speakerPlayer"}, "schema": {"name": "playbackState"}}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "speakerPlayer", "state": "PLAY", "type": "Player"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": []
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "speakerPlayer", "value": "PLAY"}
      ]
    }
  }
];
