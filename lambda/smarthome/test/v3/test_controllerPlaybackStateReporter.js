module.exports = [
  {
    description: "report state playback reporter",
    directive: {
      "header": {
        "namespace": "Alexa",
        "name": "ReportState"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PlaybackStateReporter": {
              "playbackState": {
                "parameters": {}, "item": {"name": "speakerPlayer", "type": "Player"},
                "schema": {"name": "playbackState"}}}
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
          "properties": [
            {
              "namespace": "Alexa.PlaybackStateReporter",
              "name": "playbackState",
              "value": {
                "state": "PLAYING"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "StateReport"
          },
        }
      },
      openhab: []
    }
  }
];
