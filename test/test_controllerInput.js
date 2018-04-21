module.exports = [
  {
    description: "select input",
    directive: {
      "header": {
        "namespace": "Alexa.InputController",
        "name": "SelectInput"
      },
      "endpoint": {
        "endpointId": "tvSource",
        "cookie": {
          "propertyMap": JSON.stringify({
            "InputController": {"input": {"parameters": {}, "itemName": "tvSource"}}
          })
        }
      },
      "payload": {
        "input": "hdmi 1"
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.InputController",
              "name": "input",
              "value": "HDMI1"
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
        "commands": [{"name": "tvSource", "value": "HDMI1"}],
        "input": {"staged": false, "values": {"name": "tvSource", "state": "HDMI1", "type": "String"}}
      }
    }
  }
];
