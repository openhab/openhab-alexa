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
        {"name": "highTargetTemperature", "state": "75", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "71", "type": "Number"}
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
                "value": 75.0,
                "scale": "FAHRENHEIT"
              }
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "lowerSetpoint",
              "value": {
                "value": 71.0,
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
        {"name": "highTargetTemperature", "value": 75},
        {"name": "lowTargetTemperature", "value": 71}
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
    description: "set target temperature dual mode with eco setpoints",
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
              "thermostatMode": {
                "parameters": {"OFF": "0", "HEAT": "1", "COOL": "2", "AUTO":"3", "ECO":"4"},
                "item": {"name": "thermostatMode", "type": "Number"},
                "schema": {"name": "thermostatMode"}
              },
              "upperSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "highTargetTemperature"}, "schema": {"name": "temperature"}},
              "lowerSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "lowTargetTemperature"}, "schema": {"name": "temperature"}},
              "upperSetpoint#eco": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "ecoHighTargetTemperature"}, "schema": {"name": "temperature"}},
              "lowerSetpoint#eco": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "ecoLowTargetTemperature"}, "schema": {"name": "temperature"}},
            }
          })
        }
      },
      "payload": {
        "upperSetpoint": {
          "value": 82.0,
          "scale": "FAHRENHEIT"
        },
        "lowerSetpoint": {
          "value": 64.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "thermostatMode", "state": "4", "type": "Number"},
        {"name": "ecoHighTargetTemperature", "state": "82", "type": "Number"},
        {"name": "ecoLowTargetTemperature", "state": "64", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "thermostatMode",
              "value": "ECO"
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "upperSetpoint",
              "value": {
                "value": 82.0,
                "scale": "FAHRENHEIT"
              }
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "lowerSetpoint",
              "value": {
                "value": 64.0,
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
        {"name": "ecoHighTargetTemperature", "value": 82},
        {"name": "ecoLowTargetTemperature", "value": 64}
      ]
    }
  },
  {
    description: "set target temperature dual mode in cooling mode",
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
              "thermostatMode": {
                "parameters": {"OFF": "0", "HEAT": "1", "COOL": "2", "AUTO":"3"},
                "item": {"name": "thermostatMode", "type": "Number"},
                "schema": {"name": "thermostatMode"}
              },
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
          "value": 78.0,
          "scale": "FAHRENHEIT"
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "thermostatMode", "state": "2", "type": "Number"},
        {"name": "highTargetTemperature", "state": "78", "type": "Number"},
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "thermostatMode",
              "value": "COOL"
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "targetSetpoint",
              "value": {
                "value": 78.0,
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
        {"name": "highTargetTemperature", "value": 78}
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
              "thermostatMode": {
                "parameters": {"OFF": "0", "HEAT": "1", "COOL": "2", "AUTO":"3"},
                "item": {"name": "thermostatMode", "type": "Number"},
                "schema": {"name": "thermostatMode"}
              },
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
          "value": 22.5,
          "scale": "CELSIUS"
        },
      }
    },
    mocked: {
      openhab: [
        {"name": "thermostatMode", "state": "1", "type": "Number"},
        {"name": "targetTemperature", "state": "72.5", "type": "Number"},
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "thermostatMode",
              "value": "HEAT"
            },
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
          "value": 35,
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
            "message": "The target setpoint temperature cannot be set to 35°F.",
            "validRange": {
              "minimumValue": {
                "value": 40,
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
    description: "set target temperature thermostat off error",
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
              "thermostatMode": {
                "parameters": {"OFF": "0", "HEAT": "1", "COOL": "2", "AUTO":"3"},
                "item": {"name": "thermostatMode", "type": "Number"},
                "schema": {"name": "thermostatMode"}
              },
              "targetSetpoint": {"parameters": {"scale": "FAHRENHEIT"},
                "item": {"name": "targetTemperature"}, "schema": {"name": "temperature"}}
            }
          })
        }
      },
      "payload": {
        "targetSetpoint": {
          "value": 70,
          "scale": "FAHRENHEIT"
        },
      }
    },
    mocked: {
      openhab: {"name": "thermostatMode", "state": "0", "type": "Number"}
    },
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa.ThermostatController",
            "name": "ErrorResponse"
          },
          "payload": {
            "type": "THERMOSTAT_IS_OFF",
            "message": "The thermostat is off."
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "set target temperature dual setpoints unsupported error",
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
              "thermostatMode": {
                "parameters": {"OFF": "0", "HEAT": "1", "COOL": "2", "AUTO":"3"},
                "item": {"name": "thermostatMode", "type": "Number"},
                "schema": {"name": "thermostatMode"}
              },
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
      openhab: {"name": "thermostatMode", "state": "2", "type": "Number"}
    },
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa.ThermostatController",
            "name": "ErrorResponse"
          },
          "payload": {
            "type": "DUAL_SETPOINTS_UNSUPPORTED",
            "message": "The thermostat doesn't support dual setpoints in the current mode."
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "set target temperature setpoints too close error",
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
        "upperSetpoint": {
          "value": 72.0,
          "scale": "FAHRENHEIT"
        },
        "lowerSetpoint": {
          "value": 70.0,
          "scale": "FAHRENHEIT"
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
            "type": "REQUESTED_SETPOINTS_TOO_CLOSE",
            "message": "The temperature setpoints are too close together.",
            "minimumTemperatureDelta": {
              "value": 4,
              "scale": "FAHRENHEIT"
            }
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "adjust target temperature single mode",
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
    description: "adjust target temperature dual mode no thermostat mode",
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
        {"name": "lowTargetTemperature", "state": "71", "type": "Number"},
        {"name": "highTargetTemperature", "state": "77", "type": "Number"},
        {"name": "lowTargetTemperature", "state": "73", "type": "Number"}

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
                "value": 73.0,
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
        {"name": "lowTargetTemperature", "value": 73}
      ]
    }
  },
  {
    description: "adjust target temperature dual mode in cooling mode",
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
              "thermostatMode": {
                "parameters": {"OFF": "0", "HEAT": "1", "COOL": "2", "AUTO":"3"},
                "item": {"name": "thermostatMode", "type": "Number"},
                "schema": {"name": "thermostatMode"}
              },
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
        {"name": "thermostatMode", "state": "2", "type": "Number"},
        {"name": "highTargetTemperature", "state": "76", "type": "Number"},
        {"name": "highTargetTemperature", "state": "78", "type": "Number"},
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ThermostatController",
              "name": "thermostatMode",
              "value": "COOL"
            },
            {
              "namespace": "Alexa.ThermostatController",
              "name": "targetSetpoint",
              "value": {
                "value": 78.0,
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
        {"name": "highTargetTemperature", "value": 78}
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
