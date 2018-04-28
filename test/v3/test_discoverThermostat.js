module.exports = {
  description: "thermostat enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/currentTemperature1",
          "type": "Number",
          "name": "currentTemperature1",
          "tags": [
            "Alexa.TemperatureSensor.temperature:scale=Fahrenheit"
          ],
          "groupNames": ["gThermostat1"]
        },
        {
          "link": "https://myopenhab.org/rest/items/targetTemperature1",
          "type": "Number",
          "name": "targetTemperature1",
          "tags": [
            "Alexa.ThermostatController.targetSetpoint:scale=Fahrenheit"
          ],
          "groupNames": ["gThermostat1"]
        },
        {
          "link": "https://myopenhab.org/rest/items/highTargetTemperature1",
          "type": "Number",
          "name": "highTargetTemperature1",
          "tags": [
            "Alexa.ThermostatController.upperSetpoint:scale=Fahrenheit"
          ],
          "groupNames": ["gThermostat1"]
        },
        {
          "link": "https://myopenhab.org/rest/items/lowTargetTemperature1",
          "type": "Number",
          "name": "lowTargetTemperature1",
          "tags": [
            "Alexa.ThermostatController.lowerSetpoint:scale=Fahrenheit"
          ],
          "groupNames": ["gThermostat1"]
        },
        {
          "link": "https://myopenhab.org/rest/items/thermostatMode1",
          "type": "String",
          "name": "thermostatMode1",
          "tags": [
            "Alexa.ThermostatController.thermostatMode"
          ],
          "groupNames": ["gThermostat1"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gThermostat1",
      "type": "Group",
      "name": "gThermostat1",
      "label": "Thermostat 1",
      "tags": [
        "Alexa.Endpoint.Thermostat"
      ],
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
              "value": "CurrentTemperature"
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
              "value": "TargetTemperature"
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
              "value": "UpperTemperature"
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
              "value": "LowerTemperature"
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
              "value": "homekit:HeatingCoolingMode"
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
          "value": "Thermostat",
          "config": {
            "binding": "foobar",
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
          "thermostatMode": { "parameters": {}, "itemName": "thermostatMode1" }
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
    }
  }
};
