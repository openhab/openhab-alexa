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
    }
  }
};
