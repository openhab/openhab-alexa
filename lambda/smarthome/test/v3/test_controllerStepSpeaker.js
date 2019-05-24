module.exports = [
  {
    description: "adjust volume steps",
    directive: {
      "header": {
        "namespace": "Alexa.StepSpeaker",
        "name": "AdjustVolume"
      },
      "endpoint": {
        "endpointId": "gStepSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "StepSpeaker": {
              "volume": {"parameters": {}, "item": {"name": "stepSpeakerVolumeStep"}, "schema": {"name": "volumeLevel"}}}
          })
        }
      },
      "payload": {
        "volumeSteps": 10
      }
    },
    mocked: {
      openhab: [
        {"name": "stepSpeakerVolume", "state": "50", "type": "Dimmer"}
      ],
      staged: true
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
          }
        }
      },
      openhab: [
        {"name": "stepSpeakerVolumeStep", "value": 10}
      ]
    }
  },
  {
    description: "set mute volume",
    directive: {
      "header": {
        "namespace": "Alexa.StepSpeaker",
        "name": "SetMute"
      },
      "endpoint": {
        "endpointId": "gStepSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "StepSpeaker": {
              "muted": {"parameters": {}, "item": {"name": "stepSpeakerMute"}, "schema": {"name": "muteState"}}}
          })
        }
      },
      "payload": {
        "mute": true
      }
    },
    mocked: {
      openhab: {"name": "stepSpeakerMute", "state": "ON", "type": "Switch"}
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
          }
        }
      },
      openhab: [
        {"name": "stepSpeakerMute", "value": "ON"}
      ]
    }
  }
];
