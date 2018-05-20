module.exports = [
  {
    description: "report state color item",
    directive: {
      "header": {
        "namespace": "Alexa",
        "name": "ReportState"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerController": {"powerState": {"parameters": {}, "item": {"name": "light1"}}},
            "BrightnessController": {"brightness": {"parameters": {}, "item": {"name": "light1"}}},
            "ColorController": {"color": {"parameters": {}, "item": {"name": "light1"}}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "light1", "state": "0,0,42", "type": "Color"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.PowerController",
              "name": "powerState",
              "value": "ON"
            },
            {
              "namespace": "Alexa.BrightnessController",
              "name": "brightness",
              "value": 42
            },
            {
              "namespace": "Alexa.ColorController",
              "name": "color",
              "value": {
                "hue": 0,
                "saturation": 0,
                "brightness": 0.42
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
  },
  {
    description: "report state unreachable error",
    directive: {
      "header": {
        "namespace": "Alexa",
        "name": "ReportState"
      },
      "endpoint": {
        "endpointId": "switch1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerController": {"powerState": {"parameters": {}, "item": {"name": "switch1"}}},
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "switch1", "state": "NULL", "type": "Switch"}
    },
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "ErrorResponse"
          },
          "payload": {
            type: "ENDPOINT_UNREACHABLE",
            message: "Unable to reach device"
          }
        }
      },
      openhab: []
    }
  }
];
