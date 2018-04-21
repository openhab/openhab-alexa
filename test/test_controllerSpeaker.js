module.exports = [
  {
    description: "set volume",
    directive: {
      "header": {
        "namespace": "Alexa.Speaker",
        "name": "SetVolume"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "Speaker": {"volume": {"parameters": {}, "itemName": "speakerVolume"}}
          })
        }
      },
      "payload": {
        "volume": 50
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.Speaker",
              "name": "volume",
              "value": 50
            }]
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
        "commands": [{"name": "speakerVolume", "value": 50}],
        "input": {"staged": false, "values": {"name": "speakerVolume", "state": "50", "type": "Dimmer"}}
      }
    },
  },
  {
    description: "adjust volume default increment",
    directive: {
      "header": {
        "namespace": "Alexa.Speaker",
        "name": "AdjustVolume"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "Speaker": {"volume": {"parameters": {"increment": 5}, "itemName": "speakerVolume"}}
          })
        }
      },
      "payload": {
        "volume": -10,
        "volumeDefault": true
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.Speaker",
              "name": "volume",
              "value": 45
            }]
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
        "commands": [{"name": "speakerVolume", "value": 45}],
        "input": {"staged": true, "values": [
          {"name": "speakerVolume", "state": "50", "type": "Dimmer"},
          {"name": "speakerVolume", "state": "45", "type": "Dimmer"}
        ]}
      }
    },
  },
  {
    description: "set mute volume",
    directive: {
      "header": {
        "namespace": "Alexa.Speaker",
        "name": "SetMute"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "Speaker": {"muted": {"parameters": {}, "itemName": "speakerMute"}}
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
            "properties": [{
              "namespace": "Alexa.Speaker",
              "name": "muted",
              "value": true
            }]
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
        "commands": [{"name": "speakerMute", "value": "ON"}],
        "input": {"staged": false, "values": {"name": "speakerMute", "state": "ON", "type": "Switch"}}
      }
    },
  }
];
