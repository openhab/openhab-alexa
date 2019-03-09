module.exports = [
  {
    description: "set mode",
    directive: {
      "header": {
        "namespace": "Alexa.ModeController",
        "name": "SetMode",
        "instance": "WashCycle"
      },
      "endpoint": {
        "endpointId": "gWasher",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ModeController:WashCycle": {
              "mode": {
                "parameters": {
                  "supportedModes": ["Normal=Normal:Cottons", "Delicate=@Value.Delicate:Knites", "Whites=Whites"],
                  "friendlyNames": ["Wash Cycle", "Wash Setting"]
                },
                "item": {"name": "WashCycle", "type": "String"},
                "schema": {"name": "mode"}
              }
            }
          })
        }
      },
      "payload": {
        "mode": "Normal"
      }
    },
    mocked: {
      openhab: {"name": "WashCycle", "state": "Normal", "type": "String"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ModeController",
            "name": "mode",
            "instance": "WashCycle",
            "value": "Normal"
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
        {"name": "WashCycle", "value": "Normal"}
      ]
    }
  },
  {
    description: "adjust mode",
    directive: {
      "header": {
        "namespace": "Alexa.ModeController",
        "name": "AdjustMode",
        "instance": "WashTemperature"
      },
      "endpoint": {
        "endpointId": "gWasher",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ModeController:WashTemperature": {
              "mode": {
                "parameters": {
                  "supportedModes": ["0=Cold:Cool", "1=Warm", "2=Hot"],
                  "friendlyNames": ["Wash Temperature", "@Setting.WaterTemperature"],
                  "ordered": true
                },
                "item": {"name": "WashTemperature", "type": "Number"},
                "schema": {"name": "mode"}
              }
            }
          })
        }
      },
      "payload": {
        "modeDelta": 1
      }
    },
    mocked: {
      openhab: [
        {"name": "WashTemperature", "state": "0", "type": "Number"},
        {"name": "WashTemperature", "state": "1", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ModeController",
            "name": "mode",
            "instance": "WashTemperature",
            "value": "1"
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
        {"name": "WashTemperature", "value": "1"}
      ]
    }
  },
  {
    description: "adjust mode out of range error",
    directive: {
      "header": {
        "namespace": "Alexa.ModeController",
        "name": "AdjustMode",
        "instance": "WashTemperature"
      },
      "endpoint": {
        "endpointId": "gWasher",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ModeController:WashTemperature": {
              "mode": {
                "parameters": {
                  "supportedModes": ["0=Cold:Cool", "1=Warm", "2=Hot"],
                  "friendlyNames": ["Wash Temperature", "@Setting.WaterTemperature"],
                  "ordered": true
                },
                "item": {"name": "WashTemperature", "type": "Number"},
                "schema": {"name": "mode"}
              }
            }
          })
        }
      },
      "payload": {
        "modeDelta": -1
      }
    },
    mocked: {
      openhab: {"name": "WashTemperature", "state": "0", "type": "Number"}
    },
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "ErrorResponse"
          },
          "payload": {
            "type": 'VALUE_OUT_OF_RANGE',
            "message": 'Adjusted mode value is out of range'
          }
        }
      },
      openhab: []
    }
  }
];
