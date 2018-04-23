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
            "StepSpeaker": {"volume": {"parameters": {}, "itemName": "stepSpeakerVolume"}}
          })
        }
      },
      "payload": {
        "volumeSteps": 10
      }
    },
    mocked: {
      openhab: [
        {"name": "stepSpeakerVolume", "state": "40", "type": "Dimmer"},
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
        {"name": "stepSpeakerVolume", "value": 50}
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
            "StepSpeaker": {"muted": {"parameters": {}, "itemName": "stepSpeakerMute"}}
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
