module.exports = [
  {
    description: "lock request",
    directive: {
      "header": {
        "namespace": "Alexa.LockController",
        "name": "Lock"
      },
      "endpoint": {
        "endpointId": "doorLock",
        "cookie": {
          "propertyMap": JSON.stringify({
            "LockController": {"lockState": {"parameters": {}, "itemName": "doorLock"}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "doorLock", "state": "ON", "type": "Switch"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.LockController",
            "name": "lockState",
            "value": "LOCKED"
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
        {"name": "doorLock", "value": "ON"}
      ]
    }
  },
  {
    description: "unlock request",
    directive: {
      "header": {
        "namespace": "Alexa.LockController",
        "name": "Unlock"
      },
      "endpoint": {
        "endpointId": "doorLock",
        "cookie": {
          "propertyMap": JSON.stringify({
            "LockController": {"lockState": {"parameters": {}, "itemName": "doorLock"}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "doorLock", "state": "OFF", "type": "Switch"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.LockController",
            "name": "lockState",
            "value": "UNLOCKED"
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
        {"name": "doorLock", "value": "OFF"}
      ]
    }
  },
  {
    description: "lock jammed state",
    directive: {
      "header": {
        "namespace": "Alexa.LockController",
        "name": "Lock"
      },
      "endpoint": {
        "endpointId": "doorLock",
        "cookie": {
          "propertyMap": JSON.stringify({
            "LockController": {"lockState": {"parameters": {}, "itemName": "doorLock"}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "doorLock", "state": "NULL", "type": "Switch"}
  },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.LockController",
            "name": "lockState",
            "value": "JAMMED"
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
        {"name": "doorLock", "value": "ON"}
      ]
    }
  }
];
