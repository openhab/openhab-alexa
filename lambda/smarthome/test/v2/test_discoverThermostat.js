/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */

module.exports = {
  description: "thermostat enabled group",
  mocked: [
    {
      "type": "Number",
      "name": "currentTemperature",
      "tags": ["CurrentTemperature"],
      "groupNames": ["gThermostat"]
    },
    {
      "type": "Number",
      "name": "targetTemperature",
      "tags": ["TargetTemperature"],
      "groupNames": ["gThermostat"]
    },
    {
      "type": "String",
      "name": "thermostatMode",
      "tags": ["homekit:HeatingCoolingMode"],
      "groupNames": ["gThermostat"]
    },
    {
      "type": "Group",
      "name": "gThermostat",
      "label": "Thermostat",
      "tags": ["Thermostat", "Fahrenheit"],
      "groupNames": []
    },
    {
      "type": "Number",
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
