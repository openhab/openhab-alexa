module.exports = [
  {
    description: "turn on request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "TurnOnRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "switch1"
        }
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "TurnOnConfirmation"
        }
      },
      openhab: [
        {"name": "switch1", "value": "ON"}
      ]
    }
  },
  {
    description: "turn off request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "TurnOffRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "switch1"
        }
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "TurnOffConfirmation"
        }
      },
      openhab: [
        {"name": "switch1", "value": "OFF"}
      ]
    }
  }
];
