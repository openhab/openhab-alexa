module.exports = [
  {
    description: "set power level",
    directive: {
      "header": {
        "namespace": "Alexa.PowerLevelController",
        "name": "SetPowerLevel"
      },
      "endpoint": {
        "endpointId": "device1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerLevelController": {"powerLevel": {"parameters": {}, "itemName": "device1"}}
          })
        }
      },
      "payload": {
        "powerLevel": 42
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.PowerLevelController",
              "name": "powerLevel",
              "value": 42
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
        "commands": [{"name": "device1", "value": 42}],
        "input": {"staged": false, "values": {"name": "device1", "state": "42", "type": "Dimmer"}}
      }
    }
  },
  {
    description: "adjust power level",
    directive: {
      "header": {
        "namespace": "Alexa.PowerLevelController",
        "name": "AdjustPowerLevel"
      },
      "endpoint": {
        "endpointId": "device1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerLevelController": {"powerLevel": {"parameters": {}, "itemName": "device1"}}
          })
        }
      },
      "payload": {
        "powerLevelDelta": 3
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.PowerLevelController",
              "name": "powerLevel",
              "value": 45
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
        "commands": [{"name": "device1", "value": 45}],
        "input": {"staged": true, "values": [
          {"name": "device1", "state": "42", "type": "Dimmer"},
          {"name": "device1", "state": "45", "type": "Dimmer"},
        ]}
      }
    }
  }
];
