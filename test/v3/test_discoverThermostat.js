module.exports = {
  description: "thermostat enabled group",
  locationConfig: {
    "location": "0.00000, 0.00000",
    "measurementSystem": "SI",
    "region": "US",
    "timezone": "America/Los_Angeles"
},
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/currentTemperature1",
          "type": "Number",
          "name": "currentTemperature1",
          "tags": ["CurrentTemperature"],
          "groupNames": ["gThermostat1"]
        },
        {
          "link": "https://myopenhab.org/rest/items/targetTemperature1",
          "type": "Number",
          "name": "targetTemperature1",
          "tags": ["TargetTemperature"],
          "groupNames": ["gThermostat1"]
        },
        {
          "link": "https://myopenhab.org/rest/items/highTargetTemperature1",
          "type": "Number",
          "name": "highTargetTemperature1",
          "tags": ["UpperTemperature"],
          "groupNames": ["gThermostat1"]
        },
        {
          "link": "https://myopenhab.org/rest/items/lowTargetTemperature1",
          "type": "Number",
          "name": "lowTargetTemperature1",
          "tags": ["LowerTemperature"],
          "groupNames": ["gThermostat1"]
        },
        {
          "link": "https://myopenhab.org/rest/items/thermostatMode1",
          "type": "String",
          "name": "thermostatMode1",
          "tags": ["homekit:HeatingCoolingMode"],
          "groupNames": ["gThermostat1"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gThermostat1",
      "type": "Group",
      "name": "gThermostat1",
      "label": "Thermostat 1",
      "tags": ["Thermostat", "Fahrenheit"],
      "groupNames": []
    },
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/currentTemperature2",
          "type": "Number",
          "name": "currentTemperature2",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "TemperatureSensor.temperature",
              "config": {
                "scale": "Fahrenheit"
              }
            }
          },
          "groupNames": ["gThermostat2"]
        },
        {
          "link": "https://myopenhab.org/rest/items/targetTemperature2",
          "type": "Number",
          "name": "targetTemperature2",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ThermostatController.targetSetpoint",
              "config": {
                "scale": "Fahrenheit"
              }
            }
          },
          "groupNames": ["gThermostat2"]
        },
        {
          "link": "https://myopenhab.org/rest/items/highTargetTemperature2",
          "type": "Number",
          "name": "highTargetTemperature2",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ThermostatController.upperSetpoint",
              "config": {
                "scale": "Fahrenheit"
              }
            }
          },
          "groupNames": ["gThermostat2"]
        },
        {
          "link": "https://myopenhab.org/rest/items/lowTargetTemperature2",
          "type": "Number",
          "name": "lowTargetTemperature2",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ThermostatController.lowerSetpoint",
              "config": {
                "scale": "Fahrenheit"
              }
            }
          },
          "groupNames": ["gThermostat2"]
        },
        {
          "link": "https://myopenhab.org/rest/items/thermostatMode2",
          "type": "String",
          "name": "thermostatMode2",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ThermostatController.thermostatMode",
              "config": {
                "binding": "foobar"
              }
            }
          },
          "groupNames": ["gThermostat2"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gThermostat2",
      "type": "Group",
      "name": "gThermostat2",
      "label": "Thermostat 2",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.Thermostat"
        }
      },
      "groupNames": []
    },
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/thermostatMode3",
          "type": "String",
          "name": "thermostatMode3",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ThermostatController.thermostatMode",
              "config": {
                "binding": "foobar",
                "supportedModes" : "AUTO,OFF"
              }
            }
          },
          "groupNames": ["gThermostat3"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gThermostat3",
      "type": "Group",
      "name": "gThermostat3",
      "label": "Thermostat 3",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.Thermostat"
        }
      },
      "groupNames": []
    },
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/targetTemperature4",
          "type": "Number",
          "name": "targetTemperature4",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ThermostatController.targetSetpoint",
              "config": {
                "scale": "Fahrenheit"
              }
            }
          },
          "groupNames": ["gThermostat4"]
        },
      ],
      "link": "https://myopenhab.org/rest/items/gThermostat4",
      "type": "Group",
      "name": "gThermostat4",
      "label": "Thermostat 4",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.Thermostat"
        }
      },
      "groupNames": []
    },
    {
      "link": "https://myopenhab.org/rest/items/temperature1",
      "type": "Number",
      "name": "temperature1",
      "label": "Temperature 1",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "TemperatureSensor.temperature",
          "config": {
            "scale": "Fahrenheit"
          }
        }
      },
      "groupNames": []
    }
  ],
  expected: {
    "gThermostat1": {
      "capabilities": [
        "Alexa",
        "Alexa.TemperatureSensor.temperature",
        "Alexa.ThermostatController.targetSetpoint",
        "Alexa.ThermostatController.upperSetpoint",
        "Alexa.ThermostatController.lowerSetpoint",
        "Alexa.ThermostatController.thermostatMode"
      ],
      "displayCategories": ["THERMOSTAT"],
      "friendlyName": "Thermostat 1",
      "propertyMap": {
        "TemperatureSensor": {
          "temperature": {
            "parameters": {"scale": "Fahrenheit"}, "item": {"name": "currentTemperature1", "type": "Number"}}
        },
        "ThermostatController": {
          "targetSetpoint": {
            "parameters": {"scale": "Fahrenheit"}, "item": {"name": "targetTemperature1", "type": "Number"}},
          "upperSetpoint": {
            "parameters": {"scale": "Fahrenheit"}, "item": {"name": "highTargetTemperature1", "type": "Number"}},
          "lowerSetpoint": {
            "parameters": {"scale": "Fahrenheit"}, "item": {"name": "lowTargetTemperature1", "type": "Number"}},
          "thermostatMode": {
            "parameters": {"binding": "default"}, "item": {"name": "thermostatMode1", "type": "String"}}
        }
      }
    },
    "gThermostat2": {
      "capabilities": [
        "Alexa",
        "Alexa.TemperatureSensor.temperature",
        "Alexa.ThermostatController.targetSetpoint",
        "Alexa.ThermostatController.upperSetpoint",
        "Alexa.ThermostatController.lowerSetpoint",
        "Alexa.ThermostatController.thermostatMode"
      ],
      "displayCategories": ["THERMOSTAT"],
      "friendlyName": "Thermostat 2",
      "propertyMap": {
        "TemperatureSensor": {
          "temperature": {
            "parameters": {"scale": "Fahrenheit"}, "item": {"name": "currentTemperature2", "type": "Number"}}
        },
        "ThermostatController": {
          "targetSetpoint": {
            "parameters": {"scale": "Fahrenheit"}, "item": {"name": "targetTemperature2", "type": "Number"}},
          "upperSetpoint": {
            "parameters": {"scale": "Fahrenheit"}, "item": {"name": "highTargetTemperature2", "type": "Number"}},
          "lowerSetpoint": {
            "parameters": {"scale": "Fahrenheit"}, "item": {"name": "lowTargetTemperature2", "type": "Number"}},
          "thermostatMode": {
            "parameters": {"binding": "foobar"}, "item": {"name": "thermostatMode2", "type": "String"}}
        }
      }
    },
    "gThermostat3": {
      "capabilities": [
        "Alexa",
        "Alexa.ThermostatController.thermostatMode"
      ],
      "displayCategories": ["THERMOSTAT"],
      "friendlyName": "Thermostat 3",
      "propertyMap": {
        "ThermostatController": {
          "thermostatMode": {
            "parameters": {"binding": "foobar", "supportedModes": "AUTO,OFF"},
            "item": {"name": "thermostatMode3", "type": "String"}}
        }
      }
    },
    "gThermostat4": {
      "capabilities": [
        "Alexa",
        "Alexa.ThermostatController.targetSetpoint"
      ],
      "displayCategories": ["THERMOSTAT"],
      "friendlyName": "Thermostat 4",
      "propertyMap": {
        "ThermostatController": {
          "targetSetpoint": {
            "parameters": {"scale": "Fahrenheit"}, "item": {"name": "targetTemperature4", "type": "Number"}}
        }
      }
    },
    "temperature1": {
      "capabilities": [
        "Alexa",
        "Alexa.TemperatureSensor.temperature"
      ],
      "displayCategories": ["TEMPERATURE_SENSOR"],
      "friendlyName": "Temperature 1",
      "propertyMap": {
        "TemperatureSensor": {
          "temperature": {
            "parameters": {"scale": "Fahrenheit"}, "item": {"name": "temperature1", "type": "Number"}}
        }
      }
    }
  }
};
