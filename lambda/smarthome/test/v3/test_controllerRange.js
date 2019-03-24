module.exports = [
  {
    description: "set range value",
    directive: {
      "header": {
        "namespace": "Alexa.RangeController",
        "name": "SetRangeValue",
        "instance": "BasementFan"
      },
      "endpoint": {
        "endpointId": "BasementFan",
        "cookie": {
          "propertyMap": JSON.stringify({
            "RangeController:BasementFan": {
              "rangeValue": {
                "parameters": {
                  "supportedRange": {"minimumValue": 1, "maximumValue": 10, "precision": 1},
                  "friendlyNames": ["Setting.FanSpeed"]},
                "item": {"name": "BasementFan", "type": "Number"},
                "schema": {"name": "rangeValue"}
              }
            }
          })
        }
      },
      "payload": {
        "rangeValue": 7
      }
    },
    mocked: {
      openhab: {"name": "BasementFan", "state": "7", "type": "Number"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.RangeController",
            "name": "rangeValue",
            "instance": "BasementFan",
            "value": 7
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
        {"name": "BasementFan", "value": 7}
      ]
    }
  },
  {
    description: "adjust range value",
    directive: {
      "header": {
        "namespace": "Alexa.RangeController",
        "name": "AdjustRangeValue",
        "instance": "BasementFan"
      },
      "endpoint": {
        "endpointId": "BasementFan",
        "cookie": {
          "propertyMap": JSON.stringify({
            "RangeController:BasementFan": {
              "rangeValue": {
                "parameters": {
                  "supportedRange": {"minimumValue": 1, "maximumValue": 10, "precision": 1},
                  "friendlyNames": ["Setting.FanSpeed"]},
                "item": {"name": "BasementFan", "type": "Number"},
                "schema": {"name": "rangeValue"}
              }
            }
          })
        }
      },
      "payload": {
        "rangeValueDelta": -3,
        "rangeValueDeltaDefault": false
      }
    },
    mocked: {
      openhab: [
        {"name": "BasementFan", "state": "7", "type": "Number"},
        {"name": "BasementFan", "state": "4", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.RangeController",
            "name": "rangeValue",
            "instance": "BasementFan",
            "value": 4
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
        {"name": "BasementFan", "value": 4}
      ]
    }
  }
];
