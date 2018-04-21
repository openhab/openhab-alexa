module.exports = {
  description: "thermostat enabled group",
  input: {
    "staged": false,
    "values" : [
      {
        "members": [
          {
            "link": "https://myopenhab.org/rest/items/currentTemperature",
            "type": "Number",
            "name": "currentTemperature",
            "tags": [
              "Alexa.TemperatureSensor.temperature"
            ],
            "groupNames": ["gThermostat"]
          },
          {
            "link": "https://myopenhab.org/rest/items/targetTemperature",
            "type": "Number",
            "name": "targetTemperature",
            "tags": [
              "Alexa.ThermostatController.targetSetpoint"
            ],
            "groupNames": ["gThermostat"]
          },
          {
            "link": "https://myopenhab.org/rest/items/highTargetTemperature",
            "type": "Number",
            "name": "highTargetTemperature",
            "tags": [
              "Alexa.ThermostatController.upperSetpoint"
            ],
            "groupNames": ["gThermostat"]
          },
          {
            "link": "https://myopenhab.org/rest/items/lowTargetTemperature",
            "type": "Number",
            "name": "lowTargetTemperature",
            "tags": [
              "Alexa.ThermostatController.lowerSetpoint"
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
        "tags": [
          "Alexa.Endpoint.Thermostat"
        ],
        "groupNames": []
      }
    ]
  },
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
      "displayCategories": ["THERMOSTAT", "TEMPERATURE_SENSOR"]
    }
  }
};
