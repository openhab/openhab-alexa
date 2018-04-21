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
    expected: {
      "alexa": {
        "response": {
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
              "namespace":"Alexa",
              "name": "Response"
            },
          }
        }
      },
      "openhab": {
        "commands": [{"name": "light1", "value": "350.5,71.38,65.24"}],
        "input": {"staged": false, "values": {"name": "light1", "state": "350.5,71.38,65.24", "type": "Color"}}
      }
    }
  }
];
