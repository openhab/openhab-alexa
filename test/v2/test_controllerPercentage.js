module.exports = [
  {
    description: "set percentage request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "SetPercentageRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "dimmer1"
        },
        "percentageState": {
          "value": 50
        }
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "SetPercentageConfirmation"
        }
      },
      openhab: [
        {"name": "dimmer1", "value": "50"}
      ]
    }
  },
  {
    description: "increase percentage request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "IncrementPercentageRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "dimmer1"
        },
        "deltaPercentage": {
          "value": 10
        }
      }
    },
    mocked: {
      openhab: {"name": "dimmer1", "state": "50", "type": "Dimmer"}
    },
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "IncrementPercentageConfirmation"
        }
      },
      openhab: [
        {"name": "dimmer1", "value": "60"}
      ]
    }
  },
  {
    description: "decrease percentage request",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "DecrementPercentageRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "dimmer1"
        },
        "deltaPercentage": {
          "value": 10
        }
      }
    },
    mocked: {
      openhab: {"name": "dimmer1", "state": "50", "type": "Dimmer"}
    },
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "DecrementPercentageConfirmation"
        }
      },
      openhab: [
        {"name": "dimmer1", "value": "40"}
      ]
    }
  }
];
