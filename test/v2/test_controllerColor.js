module.exports = [
  {
    description: "set color request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "SetColorRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "light1"
        },
        "color": {
          "hue": 350.5,
          "saturation": 0.7138,
          "brightness": 0.6524
        }
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "SetColorConfirmation"
        },
        "payload": {
          "achievedState": {
            "color": {
              "hue": 350.5,
              "saturation": 0.7138,
              "brightness": 0.6524
            }
          }
        }
      },
      openhab: [
        {"name": "light1", "value": "350.5,71.38,65.24"}
      ]
    }
  }
];
