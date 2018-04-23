module.exports = [
  {
    description: "set color",
    directive: {
      "header": {
        "namespace": "Alexa.ColorController",
        "name": "SetColor"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ColorController": {"color": {"parameters": {}, "itemName": "light1"}}
          })
        }
      },
      "payload": {
        "color": {
          "hue": 350.5,
          "saturation": 0.7138,
          "brightness": 0.6524
        }
      }
    },
    mocked: {
      openhab: {"name": "light1", "state": "350.5,71.38,65.24", "type": "Color"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ColorController",
            "name": "color",
            "value": {
              "hue": 350.5,
              "saturation": 0.7138,
              "brightness": 0.6524
            }
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
        {"name": "light1", "value": "350.5,71.38,65.24"}
      ]
    }
  }
];
