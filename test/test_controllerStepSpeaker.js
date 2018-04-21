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
        "commands": [{"name": "stepSpeakerVolume", "value": 50}],
        "input": {"staged": true, "values": [
          {"name": "stepSpeakerVolume", "state": "40", "type": "Dimmer"},
          {"name": "stepSpeakerVolume", "state": "50", "type": "Dimmer"}
        ]}
      }
    },
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
        "commands": [{"name": "stepSpeakerMute", "value": "ON"}],
        "input": {"staged": false, "values": {"name": "stepSpeakerMute", "state": "ON", "type": "Switch"}}
      }
    },
  }
];
