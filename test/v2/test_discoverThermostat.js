module.exports = {
  description: "thermostat enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/currentTemperature",
          "type": "Number",
          "name": "currentTemperature",
          "tags": ["CurrentTemperature"],
          "groupNames": ["gThermostat"]
        },
        {
          "link": "https://myopenhab.org/rest/items/targetTemperature",
          "type": "Number",
          "name": "targetTemperature",
          "tags": ["TargetTemperature"],
          "groupNames": ["gThermostat"]
        },
        {
          "link": "https://myopenhab.org/rest/items/thermostatMode",
          "type": "String",
          "name": "thermostatMode",
          "tags": ["homekit:HeatingCoolingMode"],
          "groupNames": ["gThermostat"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gThermostat",
      "type": "Group",
      "name": "gThermostat",
      "label": "Thermostat",
      "tags": ["Thermostat", "Fahrenheit"],
      "groupNames": []
    },
    {
      "link": "https://myopenhab.org/rest/items/temperature",
      "type": "Group",
      "name": "temperature",
      "label": "Temperature",
      "tags": ["CurrentTemperature", "Fahrenheit"],
      "groupNames": []
    }
  ],
  expected: {
    "gThermostat": {
      "actions": [
        "setTargetTemperature",
        "incrementTargetTemperature",
        "decrementTargetTemperature",
        "getTargetTemperature",
        "getTemperatureReading"
      ],
      "additionalApplianceDetails": {
        "temperatureFormat": "fahrenheit"
      },
      "applianceTypes": ["THERMOSTAT"],
      "friendlyName": "Thermostat"
    },
    "temperature": {
      "actions": [
        "getTemperatureReading"
      ],
      "additionalApplianceDetails": {
        "temperatureFormat": "fahrenheit"
      },
      "applianceTypes": ["TEMPERATURE_SENSOR"],
      "friendlyName": "Temperature"
    }
  }
};
