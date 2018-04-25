module.exports = [
  {
    description: "get lock state",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Query",
        "name": "GetLockStateRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "doorLock"
        }
      }
    },
    mocked: {
      openhab: {"name": "doorLock", "state": "ON", "type": "Switch"}
    },
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Query",
          "name": "GetLockStateResponse"
        },
        "payload": {
          "lockState": "LOCKED"
        }
      },
      openhab: []
    }
  },
  {
    description: "set lock state",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "SetLockStateRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "doorLock"
        },
        "lockState": "LOCKED"
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "SetLockStateConfirmation"
        },
        "payload": {
          "lockState": "LOCKED"
        }
      },
      openhab: [
        {"name": "doorLock", "value": "ON"}
      ]
    }
  }
];
