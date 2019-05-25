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
    mocked: {},
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.EndpointHealth",
            "name": "connectivity",
            "value": {
              "value": "OK"
            }
          }]
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
