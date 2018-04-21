module.exports = [
  {
    description: "set percentage",
    directive: {
      "header": {
        "namespace": "Alexa.PercentageController",
        "name": "SetPercentage"
      },
      "endpoint": {
        "endpointId": "device1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PercentageController": {"percentage": {"parameters": {}, "itemName": "device1"}}
          })
        }
      },
      "payload": {
        "percentage": 42
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.PercentageController",
              "name": "percentage",
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
    description: "adjust percentage",
    directive: {
      "header": {
        "namespace": "Alexa.PercentageController",
        "name": "AdjustPercentage"
      },
      "endpoint": {
        "endpointId": "device1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PercentageController": {"percentage": {"parameters": {}, "itemName": "device1"}}
          })
        }
      },
      "payload": {
        "percentageDelta": 3
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.PercentageController",
              "name": "percentage",
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
