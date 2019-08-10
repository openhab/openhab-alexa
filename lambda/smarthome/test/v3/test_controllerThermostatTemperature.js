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
    description: "set target temperature triple mode",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "SetTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "targetTemperature"}, "schema": {"name": "temperature"}},
              "upperSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "highTargetTemperature"}, "schema": {"name": "temperature"}},
              "lowerSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "lowTargetTemperature"}, "schema": {"name": "temperature"}}
            }
          })
        }
      },
      "payload": {
        "targetSetpoint": {
          "value": 73.0,
          "scale": "FAHRENHEIT"
        },
        "upperSetpoint": {
          "value": 78.0,
          "scale": "FAHRENHEIT"
        },
        "lowerSetpoint": {
          "value": 68.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "targetTemperature", "state": "73", "type": "Number"},
        {"name": "highTargetTemperature", "state": "78", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "68", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "targetSetpoint",
              "value": {
                "value": 73.0,
                "scale": "FAHRENHEIT"
              }
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "upperSetpoint",
              "value": {
                "value": 78.0,
                "scale": "FAHRENHEIT"
              }
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "lowerSetpoint",
              "value": {
                "value": 68.0,
                "scale": "FAHRENHEIT"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "targetTemperature", "value": 73},
        {"name": "highTargetTemperature", "value": 78},
        {"name": "lowTargetTemperature", "value": 68}
      ]
    }
  },
  {
    description: "set target temperature dual mode",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "SetTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "upperSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "highTargetTemperature"}, "schema": {"name": "temperature"}},
              "lowerSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "lowTargetTemperature"}, "schema": {"name": "temperature"}}
            }
          })
        }
      },
      "payload": {
        "targetSetpoint": {
          "value": 73.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "highTargetTemperature", "state": "74", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "72", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "upperSetpoint",
              "value": {
                "value": 74.0,
                "scale": "FAHRENHEIT"
              }
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "lowerSetpoint",
              "value": {
                "value": 72.0,
                "scale": "FAHRENHEIT"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "highTargetTemperature", "value": 74},
        {"name": "lowTargetTemperature", "value": 72}
      ]
    }
  },
  {
    description: "set target temperature dual mode with comfort range defined",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "SetTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "upperSetpoint": {"parameters": {"scale": "FAHRENHEIT", "comfortRange": 5},
                "item": {"name": "highTargetTemperature"}, "schema": {"name": "temperature"}},
              "lowerSetpoint": {"parameters": {"scale": "FAHRENHEIT", "comfortRange": 5},
                "item": {"name": "lowTargetTemperature"}, "schema": {"name": "temperature"}},
            }
          })
        }
      },
      "payload": {
        "targetSetpoint": {
          "value": 73.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "highTargetTemperature", "state": "78", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "68", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "upperSetpoint",
              "value": {
                "value": 78.0,
                "scale": "FAHRENHEIT"
              }
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "lowerSetpoint",
              "value": {
                "value": 68.0,
                "scale": "FAHRENHEIT"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "highTargetTemperature", "value": 78},
        {"name": "lowTargetTemperature", "value": 68}
      ]
    }
  },
  {
    description: "set target temperature single mode with conversion",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "SetTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "targetTemperature"}, "schema": {"name": "temperature"}}
            }
          })
        }
      },
      "payload": {
        "targetSetpoint": {
          "value": 22.5,
          "scale": "CELSIUS"
        },
      }
    },
    mocked: {
      openhab: [
        {"name": "targetTemperature", "state": "72.5", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "targetSetpoint",
              "value": {
                "value": 72.5,
                "scale": "FAHRENHEIT"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "targetTemperature", "value": 72.5}
      ]
    }
  },
  {
    description: "set target temperature out of range error",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "SetTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "targetTemperature"}, "schema": {"name": "temperature"}}
            }
          })
        }
      },
      "payload": {
        "targetSetpoint": {
          "value": 40,
          "scale": "FAHRENHEIT"
        },
      }
    },
    mocked: {},
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "ErrorResponse"
          },
          "payload": {
            "type": "TEMPERATURE_VALUE_OUT_OF_RANGE",
            "message": "The target setpoint temperature cannot be set to 40°F.",
            "validRange": {
              "minimumValue": {
                "value": 50,
                "scale": "FAHRENHEIT"
              },
              "maximumValue": {
                "value": 90,
                "scale": "FAHRENHEIT"
              }
            }
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "adjust target temperature",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "AdjustTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "targetTemperature"}, "schema": {"name": "temperature"}}
            }
          })
        }
      },
      "payload": {
        "targetSetpointDelta": {
          "value": 2.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "targetTemperature", "state": "73", "type": "Number"},
        {"name": "targetTemperature", "state": "75", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "targetSetpoint",
              "value": {
                "value": 75.0,
                "scale": "FAHRENHEIT"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "targetTemperature", "value": 75}
      ]
    }
  },
  {
    description: "adjust target temperature with dual mode",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "AdjustTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "upperSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "highTargetTemperature"}, "schema": {"name": "temperature"}},
              "lowerSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "lowTargetTemperature"}, "schema": {"name": "temperature"}}
            }
          })
        }
      },
      "payload": {
        "targetSetpointDelta": {
          "value": 2.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "highTargetTemperature", "state": "75", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "73", "type": "Number"},
        {"name": "highTargetTemperature", "state": "77", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "75", "type": "Number"}

      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "upperSetpoint",
              "value": {
                "value": 77.0,
                "scale": "FAHRENHEIT"
              }
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "lowerSetpoint",
              "value": {
                "value": 75.0,
                "scale": "FAHRENHEIT"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "highTargetTemperature", "value": 77},
        {"name": "lowTargetTemperature", "value": 75}
      ]
    }
  },
  {
    description: "adjust target temperature with conversion",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "AdjustTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "targetTemperature"}, "schema": {"name": "temperature"}}
            }
          })
        }
      },
      "payload": {
        "targetSetpointDelta": {
          "value": 2.0,
          "scale": "CELSIUS"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "targetTemperature", "state": "72", "type": "Number"},
        {"name": "targetTemperature", "state": "75.6", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "targetSetpoint",
              "value": {
                "value": 75.6,
                "scale": "FAHRENHEIT"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "targetTemperature", "value": 75.6}
      ]
    }
  },
  {
    description: "adjust target temperature with capping",
    directive: {
      "header": {
        "namespace": "Alexa.ThermostatController",
        "name": "AdjustTargetTemperature"
      },
      "endpoint": {
        "endpointId": "gThermostat",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ThermostatController": {
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT", "setpointRange": [60, 90]},
                "item": {"name": "targetTemperature"}, "schema": {"name": "temperature"}}
            }
          })
        }
      },
      "payload": {
        "targetSetpointDelta": {
          "value": -2.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "targetTemperature", "state": "60", "type": "Number"},
        {"name": "targetTemperature", "state": "60", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "targetSetpoint",
              "value": {
                "value": 60,
                "scale": "FAHRENHEIT"
              }
            }
          ]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          }
        }
      },
      openhab: [
        {"name": "targetTemperature", "value": 60}
      ]
    }
  }
];
