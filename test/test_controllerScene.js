module.exports = [
  {
    description: "activate scene",
    directive: {
      "header": {
        "namespace": "Alexa.SceneController",
        "name": "Activate"
      },
      "endpoint": {
        "endpointId": "scene1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "SceneController": {"scene": {"parameters": {}, "itemName": "scene1"}}
          })
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "event": {
            "header": {
              "namespace":"Alexa.SceneController",
              "name": "ActivationStarted"
            },
            "payload": {
              "cause": {
                "type": "VOICE_INTERACTION"}
              }
          }
        }
      },
      "openhab": {
        "commands": [{"name": "scene1", "value": "ON"}],
        "input": {"staged": false, "values": null}
      }
    },
  },
  {
    description: "deactivate scene",
    directive: {
      "header": {
        "namespace": "Alexa.SceneController",
        "name": "Deactivate"
      },
      "endpoint": {
        "endpointId": "scene1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "SceneController": {"scene": {"parameters": {}, "itemName": "scene1"}}
          })
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "event": {
            "header": {
              "namespace":"Alexa.SceneController",
              "name": "DeactivationStarted"
            },
            "payload": {
              "cause": {
                "type": "VOICE_INTERACTION"}
              }
          }
        }
      },
      "openhab": {
        "commands": [{"name": "scene1", "value": "OFF"}],
        "input": {"staged": false, "values": null}
      }
    }
  }
];
