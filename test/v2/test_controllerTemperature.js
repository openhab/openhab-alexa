module.exports = [
  {
    description: "get temperature reading",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Query",
        "name": "GetTemperatureReadingRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "gThermostat",
          "additionalApplianceDetails": {"temperatureFormat": "fahrenheit"}
        }
      }
    },
    mocked: {
      openhab: {
        "members": [
          {"name": "currentTemperature", "state": "75", "type": "Number", "tags": ["CurrentTemperature"]}
        ],
        "name": "gThermostat",
        "type": "Group",
        "tags": ["Thermostat", "Fahrenheit"]
      }
    },
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Query",
          "name": "GetTemperatureReadingResponse"
        },
        "payload": {
          "temperatureReading": {
            "value": 75,
            "scale": "FAHRENHEIT"
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "get target temperature",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Query",
        "name": "GetTargetTemperatureRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "gThermostat",
          "additionalApplianceDetails": {"temperatureFormat": "fahrenheit"}
        }
      }
    },
    mocked: {
      openhab: {
        "members": [
          {"name": "targetTemperature", "state": "75", "type": "Number", "tags": ["TargetTemperature"]},
          {"name": "thermostatMode", "state": "heat", "type": "String", "tags": ["homekit:HeatingCoolingMode"]}
        ],
        "name": "gThermostat",
        "type": "Group",
        "tags": ["Thermostat", "Fahrenheit"]
      }
    },
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Query",
          "name": "GetTargetTemperatureResponse"
        },
        "payload": {
          "targetTemperature": {
            "value": 75,
            "scale": "FAHRENHEIT"
          },
          "temperatureMode": {
            "value": "HEAT"
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "set target temperature",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "SetTargetTemperatureRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "gThermostat",
          "additionalApplianceDetails": {"temperatureFormat": "fahrenheit"}
        },
        "targetTemperature": {
          "value": 25.0
        }
      }
    },
    mocked: {
      openhab: {
        "members": [
          {"name": "currentTemperature", "state": "75", "type": "Number", "tags": ["CurrentTemperature"]},
          {"name": "targetTemperature", "state": "75", "type": "Number", "tags": ["TargetTemperature"]},
          {"name": "thermostatMode", "state": "heat", "type": "String", "tags": ["homekit:HeatingCoolingMode"]}
        ],
        "name": "gThermostat",
        "type": "Group",
        "tags": ["Thermostat", "Fahrenheit"]
      }
    },
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "SetTargetTemperatureConfirmation"
        },
        "payload": {
          "targetTemperature": {
            "value": 77,
            "scale": "FAHRENHEIT"
          },
          "temperatureMode": {
            "value": "HEAT"
          },
          "previousState": {
            "targetTemperature": {
              "value": 75,
              "scale": "FAHRENHEIT"
            },
            "mode": {
              "value": "HEAT"
            }
          }
        }
      },
      openhab: [
        {"name": "targetTemperature", "value": "77"},
      ]
    }
  },
  {
    description: "increase target temperature",
    directive: {
      "header": {
        "namespace": "Alexa.ConnectedHome.Control",
        "name": "IncrementTargetTemperatureRequest",
        "payloadVersion": "2"
      },
      "payload": {
        "appliance": {
          "applianceId": "gThermostat",
          "additionalApplianceDetails": {"temperatureFormat": "fahrenheit"}
        },
        "deltaTemperature": {
          "value": 2.0
        }
      }
    },
    mocked: {
      openhab: {
        "members": [
          {"name": "currentTemperature", "state": "75", "type": "Number", "tags": ["CurrentTemperature"]},
          {"name": "targetTemperature", "state": "75", "type": "Number", "tags": ["TargetTemperature"]},
          {"name": "thermostatMode", "state": "heat", "type": "String", "tags": ["homekit:HeatingCoolingMode"]}
        ],
        "name": "gThermostat",
        "type": "Group",
        "tags": ["Thermostat", "Fahrenheit"]
      }
    },
    expected: {
      alexa: {
        "header": {
          "namespace": "Alexa.ConnectedHome.Control",
          "name": "IncrementTargetTemperatureConfirmation"
        },
        "payload": {
          "targetTemperature": {
            "value": 77,
            "scale": "FAHRENHEIT"
          },
          "temperatureMode": {
            "value": "HEAT"
          },
          "previousState": {
            "targetTemperature": {
              "value": 75,
              "scale": "FAHRENHEIT"
            },
            "mode": {
              "value": "HEAT"
            }
          }
        }
      },
      openhab: [
        {"name": "targetTemperature", "value": "77"},
      ]
    }
  }
];
