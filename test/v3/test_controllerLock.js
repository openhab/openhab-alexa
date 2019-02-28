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
            "LockController": {
              "lockState": {
                "parameters": {}, "item": {"name": "doorLock", "type": "Switch"}, "schema": {"name": "lockState"}}}
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
            "LockController": {
              "lockState": {
                "parameters": {}, "item": {"name": "doorLock", "type": "Switch"}, "schema": {"name": "lockState"}}}
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
    description: "lock jammed sensor state map parameters",
    directive: {
      "header": {
        "namespace": "Alexa.LockController",
        "name": "Lock"
      },
      "endpoint": {
        "endpointId": "doorLock",
        "cookie": {
          "propertyMap": JSON.stringify({
            "LockController": {"lockState": {
              "parameters": {"LOCKED": 1, "UNLOCKED": 2, "JAMMED": 42},
              "item": {"name": "doorLock", "sensor": "doorLockSensor", "type": "Number"},
              "schema": {"name": "lockState"}}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "doorLockSensor", "state": "42", "type": "Number"}
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
