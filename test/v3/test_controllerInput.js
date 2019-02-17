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
            "InputController": {"input": {"parameters": {}, "item": {"name": "tvSource"}}}
          })
        }
      },
      "payload": {
        "input": "hdmi 1"
      }
    },
    mocked: {
      openhab: {"name": "tvSource", "state": "HDMI1", "type": "String"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.InputController",
            "name": "input",
            "value": "HDMI1"
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
        {"name": "tvSource", "value": "HDMI1"}
      ]
    }
  }
];
