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
            "PowerController": {"powerState": {"parameters": {}, "itemName": "light1"}},
            "BrightnessController": {"brightness": {"parameters": {}, "itemName": "light1"}},
            "ColorController": {"color": {"parameters": {}, "itemName": "light1"}}
          })
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "light1", "state": "0,0,42", "type": "Color"}
      ]
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
  }
];
