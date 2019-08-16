/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
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
      "name": "currentTemperature1",
      "tags": ["CurrentTemperature"],
      "groupNames": ["gThermostat1"]
    },
    {
      "type": "Number",
      "name": "targetTemperature1",
      "tags": ["TargetTemperature"],
      "groupNames": ["gThermostat1"]
    },
    {
      "type": "Number",
      "name": "highTargetTemperature1",
      "tags": ["UpperTemperature"],
      "groupNames": ["gThermostat1"]
    },
    {
      "type": "Number",
      "name": "lowTargetTemperature1",
      "tags": ["LowerTemperature"],
      "groupNames": ["gThermostat1"]
    },
    {
      "type": "String",
      "name": "thermostatMode1",
      "tags": ["homekit:HeatingCoolingMode"],
      "groupNames": ["gThermostat1"]
    },
    {
      "type": "Group",
      "name": "gThermostat1",
      "label": "Thermostat 1",
      "tags": ["Thermostat", "Fahrenheit"],
      "groupNames": []
    },
    {
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
      "type": "String",
      "name": "thermostatMode2",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ThermostatController.thermostatMode",
          "config": {
            "OFF": "off",
            "HEAT": "heat"
          }
        },
        "channel": {
          "value": "foobar:thermostat:mode"
        }
      },
      "groupNames": ["gThermostat2"]
    },
    {
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
      "type": "String",
      "name": "thermostatMode3",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ThermostatController.thermostatMode",
          "config": {
            "supportedModes" : "AUTO,OFF,FOOBAR"
          }
        }
      },
      "groupNames": ["gThermostat3"]
    },
    {
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
      "type": "Number",
      "name": "targetTemperature4",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ThermostatController.targetSetpoint",
          "config": {
            "scale": "Fahrenheit",
            "setpointRange": "60:90"
          }
        }
      },
      "groupNames": ["gThermostat4"]
    },
    {
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
      "type": "Switch",
      "name": "thermostatMode5",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ThermostatController.thermostatMode",
          "config": {}
        }
      },
      "groupNames": ["gThermostat5"]
    },
    {
      "type": "Group",
      "name": "gThermostat5",
      "label": "Thermostat 5",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.Thermostat"
        }
      },
      "groupNames": []
    },
    {
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
    },
    {
      "state": "20 °C",
      "type": "Number:Temperature",
      "name": "temperature2",
      "label": "Temperature 2",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "TemperatureSensor.temperature"
        }
      },
      "groupNames": []
    },
    {
      "type": "Number",
      "name": "temperature3",
      "label": "Temperature 3",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "TemperatureSensor.temperature"
        }
      },
      "groupNames": []
    }
  ],
  settings: {
    regional: {
      'measurementSystem': 'US',
      'region': 'US'
    }
  },
  expected: {
    "gThermostat1": {
      "capabilities": [
        "Alexa",
        "Alexa.TemperatureSensor.temperature",
        "Alexa.ThermostatController.targetSetpoint",
        "Alexa.ThermostatController.upperSetpoint",
        "Alexa.ThermostatController.lowerSetpoint",
        "Alexa.ThermostatController.thermostatMode",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["THERMOSTAT"],
      "friendlyName": "Thermostat 1",
      "configuration": {
        "Alexa.ThermostatController": {
          "supportsScheduling": false
        }
      },
      "propertyMap": {
        "TemperatureSensor": {
          "temperature": {
            "parameters": {"scale": "FAHRENHEIT"},
            "item": {"name": "currentTemperature1", "type": "Number"},
            "schema": {"name": "temperature"}
          }
        },
        "ThermostatController": {
          "targetSetpoint": {
            "parameters": {"scale": "FAHRENHEIT"},
            "item": {"name": "targetTemperature1", "type": "Number"},
            "schema": {"name": "temperature"}
          },
          "upperSetpoint": {
            "parameters": {"scale": "FAHRENHEIT"},
            "item": {"name": "highTargetTemperature1", "type": "Number"},
            "schema": {"name": "temperature"}
          },
          "lowerSetpoint": {
            "parameters": {"scale": "FAHRENHEIT"},
            "item": {"name": "lowTargetTemperature1", "type": "Number"},
            "schema": {"name": "temperature"}
          },
          "thermostatMode": {
            "parameters": {},
            "item": {"name": "thermostatMode1", "type": "String"},
            "schema": {"name": "thermostatMode"}
          }
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
        "Alexa.ThermostatController.thermostatMode",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["THERMOSTAT"],
      "friendlyName": "Thermostat 2",
      "configuration": {
        "Alexa.ThermostatController": {
          "supportsScheduling": false,
          "supportedModes": ["HEAT", "OFF"]
        }
      },
      "propertyMap": {
        "TemperatureSensor": {
          "temperature": {
            "parameters": {"scale": "FAHRENHEIT"},
            "item": {"name": "currentTemperature2", "type": "Number"},
            "schema": {"name": "temperature"}
          }
        },
        "ThermostatController": {
          "targetSetpoint": {
            "parameters": {"scale": "FAHRENHEIT"},
            "item": {"name": "targetTemperature2", "type": "Number"},
            "schema": {"name": "temperature"}
          },
          "upperSetpoint": {
            "parameters": {"scale": "FAHRENHEIT"},
            "item": {"name": "highTargetTemperature2", "type": "Number"},
            "schema": {"name": "temperature"}
          },
          "lowerSetpoint": {
            "parameters": {"scale": "FAHRENHEIT"},
            "item": {"name": "lowTargetTemperature2", "type": "Number"},
            "schema": {"name": "temperature"}
          },
          "thermostatMode": {
            "parameters": {"OFF": "off", "HEAT": "heat", "binding": "foobar", "supportedModes": ["HEAT", "OFF"]},
            "item": {"name": "thermostatMode2", "type": "String"},
            "schema": {"name": "thermostatMode"}
          }
        }
      }
    },
    "gThermostat3": {
      "capabilities": [
        "Alexa",
        "Alexa.ThermostatController.thermostatMode",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["THERMOSTAT"],
      "friendlyName": "Thermostat 3",
      "configuration": {
        "Alexa.ThermostatController": {
          "supportsScheduling": false,
          "supportedModes": ["AUTO", "OFF"]
        }
      }
    },
    "gThermostat4": {
      "capabilities": [
        "Alexa",
        "Alexa.ThermostatController.targetSetpoint",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["THERMOSTAT"],
      "friendlyName": "Thermostat 4",
      "propertyMap": {
        "ThermostatController": {
          "targetSetpoint": {
            "parameters": {"scale": "FAHRENHEIT", "setpointRange": [60, 90]},
            "item": {"name": "targetTemperature4", "type": "Number"},
            "schema": {"name": "temperature"}
          }
        }
      }
    },
    "gThermostat5": {
      "capabilities": [
        "Alexa",
        "Alexa.ThermostatController.thermostatMode",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["THERMOSTAT"],
      "friendlyName": "Thermostat 5",
      "configuration": {
        "Alexa.ThermostatController": {
          "supportsScheduling": false,
          "supportedModes": ["HEAT", "OFF"]
        }
      }
    },
    "temperature1": {
      "capabilities": [
        "Alexa",
        "Alexa.TemperatureSensor.temperature",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["TEMPERATURE_SENSOR"],
      "friendlyName": "Temperature 1",
      "propertyMap": {
        "TemperatureSensor": {
          "temperature": {
            "parameters": {"scale": "FAHRENHEIT"},
            "item": {"name": "temperature1", "type": "Number"},
            "schema": {"name": "temperature"}
          }
        }
      }
    },
    "temperature2": {
      "capabilities": [
        "Alexa",
        "Alexa.TemperatureSensor.temperature",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["TEMPERATURE_SENSOR"],
      "friendlyName": "Temperature 2",
      "propertyMap": {
        "TemperatureSensor": {
          "temperature": {
            "parameters": {"scale": "CELSIUS"},
            "item": {"name": "temperature2", "type": "Number:Temperature"},
            "schema": {"name": "temperature"}
          }
        }
      }
    },
    "temperature3": {
      "capabilities": [
        "Alexa",
        "Alexa.TemperatureSensor.temperature",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["TEMPERATURE_SENSOR"],
      "friendlyName": "Temperature 3",
      "propertyMap": {
        "TemperatureSensor": {
          "temperature": {
            "parameters": {"scale": "FAHRENHEIT"},
            "item": {"name": "temperature3", "type": "Number"},
            "schema": {"name": "temperature"}
          }
        }
      }
    }
  }
};
