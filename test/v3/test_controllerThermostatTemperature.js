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
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "item": {"name": "targetTemperature"}},
              "upperSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "item": {"name": "highTargetTemperature"}},
              "lowerSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "item": {"name": "lowTargetTemperature"}}
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
    mocked: {
      openhab: [
        {"name": "targetTemperature", "state": "73", "type": "Number"},
        {"name": "highTargetTemperature", "state": "78", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "68", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
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
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "targetTemperature", "value": 73},
        {"name": "highTargetTemperature", "value": 78},
        {"name": "lowTargetTemperature", "value": 68}
      ]
    }
  },
  {
    description: "set target temperature dual mode",
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
              "upperSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "item": {"name": "highTargetTemperature"}},
              "lowerSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "item": {"name": "lowTargetTemperature"}}
            }
          })
        }
      },
      "payload": {
        "targetSetpoint": {
          "value": 73.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "highTargetTemperature", "state": "74", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "72", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "upperSetpoint",
              "value": {
                "value": 74.0,
                "scale": "FAHRENHEIT"
              }
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "lowerSetpoint",
              "value": {
                "value": 72.0,
                "scale": "FAHRENHEIT"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "highTargetTemperature", "value": 74},
        {"name": "lowTargetTemperature", "value": 72}
      ]
    }
  },
  {
    description: "set target temperature dual mode with comfort_range defined",
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
              "upperSetpoint": {"parameters": {"scale": "FAHRENHEIT", "comfort_range": 5}, "item": {"name": "highTargetTemperature"}},
              "lowerSetpoint": {"parameters": {"scale": "FAHRENHEIT", "comfort_range": 5}, "item": {"name": "lowTargetTemperature"}},
            }
          })
        }
      },
      "payload": {
        "targetSetpoint": {
          "value": 73.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "highTargetTemperature", "state": "78", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "68", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
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
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "highTargetTemperature", "value": 78},
        {"name": "lowTargetTemperature", "value": 68}
      ]
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
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "item": {"name": "targetTemperature"}}
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
    mocked: {
      openhab: [
        {"name": "targetTemperature", "state": "73", "type": "Number"},
        {"name": "targetTemperature", "state": "75", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
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
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "targetTemperature", "value": 75}
      ]
    }
  },
  {
    description: "adjust target temperature with dual mode",
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
              "upperSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "item": {"name": "highTargetTemperature"}},
              "lowerSetpoint": {"parameters": {"scale": "FAHRENHEIT"}, "item": {"name": "lowTargetTemperature"}}
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
    mocked: {
      openhab: [
        {"name": "highTargetTemperature", "state": "75", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "73", "type": "Number"},
        {"name": "highTargetTemperature", "state": "77", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "75", "type": "Number"}

      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "upperSetpoint",
              "value": {
                "value": 77.0,
                "scale": "FAHRENHEIT"
              }
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "lowerSetpoint",
              "value": {
                "value": 75.0,
                "scale": "FAHRENHEIT"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "highTargetTemperature", "value": 77},
        {"name": "lowTargetTemperature", "value": 75}
      ]
    }
  }
];
