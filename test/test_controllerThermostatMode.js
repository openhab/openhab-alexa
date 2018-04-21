module.exports = [
  {
    description: "set thermostat mode map parameters",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "SetThermostatMode"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "thermostatMode": {
                "parameters": {"OFF": "0", "HEAT": "1", "COOL": "2","AUTO":"3"}, "itemName": "thermostatMode"
              }
            }
          })
        }
      },
      "payload": {
        "thermostatMode": {
          "value": "COOL",
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.ThermostatController",
              "name": "thermostatMode",
              "value": {
                "value": "COOL",
              }
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
        "commands": [{"name": "thermostatMode", "value": "2"}],
        "input": {"staged": false, "values": {"name": "thermostatMode", "state": "2", "type": "String"}}
      }
    }
  },
  {
    description: "set thermostat mode binding parameter",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "SetThermostatMode"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "thermostatMode": {"parameters": {"binding": "nest"}, "itemName": "thermostatMode"}
            }
          })
        }
      },
      "payload": {
        "thermostatMode": {
          "value": "AUTO",
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.ThermostatController",
              "name": "thermostatMode",
              "value": {
                "value": "AUTO",
              }
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
        "commands": [{"name": "thermostatMode", "value": "heat-cool"}],
        "input": {"staged": false, "values": {"name": "thermostatMode", "state": "heat-cool", "type": "String"}}
      }
    }
  },
  {
    description: "set thermostat unsupported mode error",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "SetThermostatMode"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "thermostatMode": {
                "parameters": {"OFF": "0", "HEAT": "1", "COOL": "2","AUTO":"3"}, "itemName": "thermostatMode"
              }
            }
          })
        }
      },
      "payload": {
        "thermostatMode": {
          "value": "ECO",
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "event": {
            "header": {
              "namespace":"Alexa",
              "name": "ErrorResponse"
            },
            "payload": {
              type: "UNSUPPORTED_THERMOSTAT_MODE",
              message: "thermostatMode doesn't support thermostat mode [ECO]",
            }
          }
        }
      },
      "openhab": {
        "commands": [],
        "input": {"staged": false, "values": null}
      }
    }
  }
];
