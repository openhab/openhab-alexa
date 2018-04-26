module.exports = {
  description: "thermostat enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/currentTemperature",
          "type": "Number",
          "name": "currentTemperature",
          "tags": [
            "Alexa.TemperatureSensor.temperature:scale=Fahrenheit"
          ],
          "groupNames": ["gThermostat"]
        },
        {
          "link": "https://myopenhab.org/rest/items/targetTemperature",
          "type": "Number",
          "name": "targetTemperature",
          "tags": [
            "Alexa.ThermostatController.targetSetpoint:scale=Fahrenheit"
          ],
          "groupNames": ["gThermostat"]
        },
        {
          "link": "https://myopenhab.org/rest/items/highTargetTemperature",
          "type": "Number",
          "name": "highTargetTemperature",
          "tags": [
            "Alexa.ThermostatController.upperSetpoint:scale=Fahrenheit"
          ],
          "groupNames": ["gThermostat"]
        },
        {
          "link": "https://myopenhab.org/rest/items/lowTargetTemperature",
          "type": "Number",
          "name": "lowTargetTemperature",
          "tags": [
            "Alexa.ThermostatController.lowerSetpoint:scale=Fahrenheit"
          ],
          "groupNames": ["gThermostat"]
        },
        {
          "link": "https://myopenhab.org/rest/items/thermostatMode",
          "type": "String",
          "name": "thermostatMode",
          "tags": [
            "Alexa.ThermostatController.thermostatMode"
          ],
          "groupNames": ["gThermostat"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gThermostat",
      "type": "Group",
      "name": "gThermostat",
      "label": "Thermostat",
      "tags": [
        "Alexa.Endpoint.Thermostat"
      ],
      "groupNames": []
    }
  ],
  expected: {
    "gThermostat": {
      "capabilities": [
        "Alexa",
        "Alexa.TemperatureSensor.temperature",
        "Alexa.ThermostatController.targetSetpoint",
        "Alexa.ThermostatController.upperSetpoint",
        "Alexa.ThermostatController.lowerSetpoint",
        "Alexa.ThermostatController.thermostatMode"
      ],
      "displayCategories": ["THERMOSTAT", "TEMPERATURE_SENSOR"],
      "friendlyName": "Thermostat",
      "propertyMap": {
        "TemperatureSensor": {
          "temperature": {"parameters": {"scale": "Fahrenheit"}, "itemName": "currentTemperature"}
        },
        "ThermostatController": {
          "targetSetpoint": {"parameters": {"scale": "Fahrenheit"}, "itemName": "targetTemperature"},
          "upperSetpoint": {"parameters": {"scale": "Fahrenheit"}, "itemName": "highTargetTemperature"},
          "lowerSetpoint": {"parameters": {"scale": "Fahrenheit"}, "itemName": "lowTargetTemperature"},
          "thermostatMode": { "parameters": {}, "itemName": "thermostatMode" }
        }
      }
    }
  }
};
