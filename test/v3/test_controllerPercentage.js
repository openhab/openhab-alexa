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
            "PercentageController": {"percentage": {"parameters": {}, "item": {"name": "device1"}}}
          })
        }
      },
      "payload": {
        "percentage": 42
      }
    },
    mocked: {
      openhab: {"name": "device1", "state": "42", "type": "Dimmer"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PercentageController",
            "name": "percentage",
            "value": 42
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
        {"name": "device1", "value": 42}
      ]
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
            "PercentageController": {"percentage": {"parameters": {}, "item": {"name": "device1"}}}
          })
        }
      },
      "payload": {
        "percentageDelta": 3
      }
    },
    mocked: {
      openhab: [
        {"name": "device1", "state": "42", "type": "Dimmer"},
        {"name": "device1", "state": "45", "type": "Dimmer"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PercentageController",
            "name": "percentage",
            "value": 45
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
        {"name": "device1", "value": 45}
      ]
    }
  }
];
