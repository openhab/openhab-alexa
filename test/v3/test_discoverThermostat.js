module.exports = {
  description: "thermostat enabled group",
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
      "link": "https://myopenhab.org/rest/items/temperature1",
      "type": "Group",
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
          "temperature": {"parameters": {"scale": "Fahrenheit"}, "itemName": "currentTemperature1"}
        },
        "ThermostatController": {
          "targetSetpoint": {"parameters": {"scale": "Fahrenheit"}, "itemName": "targetTemperature1"},
          "upperSetpoint": {"parameters": {"scale": "Fahrenheit"}, "itemName": "highTargetTemperature1"},
          "lowerSetpoint": {"parameters": {"scale": "Fahrenheit"}, "itemName": "lowTargetTemperature1"},
          "thermostatMode": { "parameters": {"binding": "default"}, "itemName": "thermostatMode1" }
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
          "temperature": {"parameters": {"scale": "Fahrenheit"}, "itemName": "currentTemperature2"}
        },
        "ThermostatController": {
          "targetSetpoint": {"parameters": {"scale": "Fahrenheit"}, "itemName": "targetTemperature2"},
          "upperSetpoint": {"parameters": {"scale": "Fahrenheit"}, "itemName": "highTargetTemperature2"},
          "lowerSetpoint": {"parameters": {"scale": "Fahrenheit"}, "itemName": "lowTargetTemperature2"},
          "thermostatMode": { "parameters": {"binding": "foobar"}, "itemName": "thermostatMode2" }
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
          "temperature": {"parameters": {"scale": "Fahrenheit"}, "itemName": "temperature1"}
        }
      }
    }
  }
};
