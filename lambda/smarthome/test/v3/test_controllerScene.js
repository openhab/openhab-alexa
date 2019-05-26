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
            "SceneController": {"scene": {"parameters": {}, "item": {"name": "scene1"}, "schema": {"name": "scene"}}}
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
            "namespace":"Alexa.SceneController",
            "name": "ActivationStarted"
          },
          "payload": {
            "cause": {
              "type": "VOICE_INTERACTION"
            }
          }
        }
      },
      openhab: [
        {"name": "scene1", "value": "ON"}
      ]
    }
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
            "SceneController": {"scene": {"parameters": {}, "item": {"name": "scene1"}, "schema": {"name": "scene"}}}
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
            "namespace":"Alexa.SceneController",
            "name": "DeactivationStarted"
          },
          "payload": {
            "cause": {
              "type": "VOICE_INTERACTION"
            }
          }
        }
      },
      openhab: [
        {"name": "scene1", "value": "OFF"}
      ]
    }
  }
];
