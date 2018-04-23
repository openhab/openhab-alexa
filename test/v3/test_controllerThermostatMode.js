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
    mocked: {
      openhab: {"name": "thermostatMode", "state": "2", "type": "String"}
    },
    expected: {
      alexa: {
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
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "thermostatMode", "value": "2"}
      ]
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
    mocked: {
      openhab: {"name": "thermostatMode", "state": "heat-cool", "type": "String"}
    },
    expected: {
      alexa: {
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
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "thermostatMode", "value": "heat-cool"}
      ]
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
    mocked: {},
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "ErrorResponse"
          },
          "payload": {
            type: "UNSUPPORTED_THERMOSTAT_MODE",
            message: "thermostatMode doesn't support thermostat mode [ECO]",
          }
        }
      },
      openhab: []
    }
  }
];
