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
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.LockController",
              "name": "lockState",
              "value": "LOCKED"
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
        "commands": [{"name": "doorLock", "value": "ON"}],
        "input": {"staged": false, "values": {"name": "doorLock", "state": "ON", "type": "Switch"}}
      }
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
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.LockController",
              "name": "lockState",
              "value": "UNLOCKED"
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
        "commands": [{"name": "doorLock", "value": "OFF"}],
        "input": {"staged": false, "values": {"name": "doorLock", "state": "OFF", "type": "Switch"}}
      }
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
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.LockController",
              "name": "lockState",
              "value": "JAMMED"
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
        "commands": [{"name": "doorLock", "value": "ON"}],
        "input": {"staged": false, "values": {"name": "doorLock", "state": "NULL", "type": "Switch"}}
      }
    }
  },
];
