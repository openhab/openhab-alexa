module.exports = [
  {
    description: "set target temperature triple mode",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "SetTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "itemName": "targetTemperature"},
              "upperSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "itemName": "highTargetTemperature"},
              "lowerSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "itemName": "lowTargetTemperature"}
            }
          })
        }
      },
      "payload": {
        "targetSetpoint": {
          "value": 73.0,
          "scale": "FAHRENHEIT"
        },
        "upperSetpoint": {
          "value": 78.0,
          "scale": "FAHRENHEIT"
        },
        "lowerSetpoint": {
          "value": 68.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [
              {
                "namespace": "Alexa.ThermostatController",
                "name": "targetSetpoint",
                "value": {
                  "value": 73.0,
                  "scale": "FAHRENHEIT"
                }
              },
              {
                "namespace": "Alexa.ThermostatController",
                "name": "upperSetpoint",
                "value": {
                  "value": 78.0,
                  "scale": "FAHRENHEIT"
                }
              },
              {
                "namespace": "Alexa.ThermostatController",
                "name": "lowerSetpoint",
                "value": {
                  "value": 68.0,
                  "scale": "FAHRENHEIT"
                }
              }
            ]
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
        "commands": [
          {"name": "targetTemperature", "value": 73},
          {"name": "highTargetTemperature", "value": 78},
          {"name": "lowTargetTemperature", "value": 68}
        ],
        "input": {"staged": false, "values": null}
      }
    }
  },
  {
    description: "adjust target temperature",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "AdjustTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "itemName": "targetTemperature"}
            }
          })
        }
      },
      "payload": {
        "targetSetpointDelta": {
          "value": 2.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [
              {
                "namespace": "Alexa.ThermostatController",
                "name": "targetSetpoint",
                "value": {
                  "value": 75.0,
                  "scale": "FAHRENHEIT"
                }
              }
            ]
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
        "commands": [{"name": "targetTemperature", "value": 75}],
        "input": {"staged": true, "values": [
          {"name": "targetTemperature", "state": "73", "type": "Number"},
          {"name": "targetTemperature", "state": "75", "type": "Number"}
        ]}
      }
    }
  }
];
