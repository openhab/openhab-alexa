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
                "parameters": {"OFF": "0", "HEAT": "1", "COOL": "2", "AUTO":"3"},
                "item": {"name": "thermostatMode", "type": "Number"},
                "schema": {"name": "thermostatMode"}
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
      openhab: {"name": "thermostatMode", "state": "2", "type": "Number"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ThermostatController",
            "name": "thermostatMode",
            "value": "COOL"
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
    description: "set thermostat mode to OFF with user map parameters with numeric values",
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
                "parameters": {"OFF": 0, "HEAT": 1, "COOL": 2, "AUTO": 3},
                "item": {"name": "thermostatMode", "type": "Number"},
                "schema": {"name": "thermostatMode"}
              }
            }
          })
        }
      },
      "payload": {
        "thermostatMode": {
          "value": "OFF",
        }
      }
    },
    mocked: {
      openhab: {"name": "thermostatMode", "state": "0", "type": "Number"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ThermostatController",
            "name": "thermostatMode",
            "value": "OFF"
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
        {"name": "thermostatMode", "value": 0}
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
              "thermostatMode": {
                "parameters": {"binding": "nest"},
                "item": {"name": "thermostatMode", "type": "String"},
                "schema": {"name": "thermostatMode"}
              }
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
      openhab: {"name": "thermostatMode", "state": "HEAT_COOL", "type": "String"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ThermostatController",
            "name": "thermostatMode",
            "value": "AUTO"
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
        {"name": "thermostatMode", "value": "HEAT_COOL"}
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
                "parameters": {"OFF": "0", "HEAT": "1", "COOL": "2", "AUTO":"3"},
                "item": {"name": "thermostatMode", "type": "Number"},
                "schema": {"name": "thermostatMode"}
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
            "namespace": "Alexa.ThermostatController",
            "name": "ErrorResponse"
          },
          "payload": {
            "type": "UNSUPPORTED_THERMOSTAT_MODE",
            "message": "thermostatMode doesn't support thermostat mode [ECO]",
          }
        }
      },
      openhab: []
    }
  }
];
