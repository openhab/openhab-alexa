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
    description: "set color temperature dimmer item",
    directive: {
      "header": {
        "namespace": "Alexa.ColorTemperatureController",
        "name": "SetColorTemperature"
      },
      "endpoint": {
        "endpointId": "gColorLight",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ColorTemperatureController": {
              "colorTemperatureInKelvin": {
                "parameters": {"range": [2700, 6500]}, "item": {"name": "colorTemperature", "type": "Dimmer"},
                "schema": {"name": "colorTemperatureInKelvin"}}}
          })
        }
      },
      "payload": {
        "colorTemperatureInKelvin": 2700
      }
    },
    mocked: {
      openhab: {"name": "colorTemperature", "state": "100", "type": "Dimmer"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ColorTemperatureController",
            "name": "colorTemperatureInKelvin",
            "value": 2700
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "colorTemperature", "value": 100}
      ]
    }
  },
  {
    description: "set color temperature out of range error",
    directive: {
      "header": {
        "namespace": "Alexa.ColorTemperatureController",
        "name": "SetColorTemperature"
      },
      "endpoint": {
        "endpointId": "gColorLight",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ColorTemperatureController": {
              "colorTemperatureInKelvin": {
                "parameters": {"range": [2200, 4000]}, "item": {"name": "colorTemperature", "type": "Dimmer"},
                "schema": {"name": "colorTemperatureInKelvin"}}}
          })
        }
      },
      "payload": {
        "colorTemperatureInKelvin": 5500
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
            "type": "VALUE_OUT_OF_RANGE",
            "message": "The color temperature cannot be set to 5500K.",
            "validRange": {
              "minimumValue": 2200,
              "maximumValue": 4000
            }
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "increase color temperature dimmer item no increment parameter",
    directive: {
      "header": {
        "namespace": "Alexa.ColorTemperatureController",
        "name": "IncreaseColorTemperature"
      },
      "endpoint": {
        "endpointId": "gColorLight",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ColorTemperatureController": {
              "colorTemperatureInKelvin": {
                "parameters": {}, "item": {"name": "colorTemperature", "type": "Dimmer"},
                "schema": {"name": "colorTemperatureInKelvin"}}}
          })
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "colorTemperature", "state": "50", "type": "Dimmer"},
        {"name": "colorTemperature", "state": "40", "type": "Dimmer"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ColorTemperatureController",
            "name": "colorTemperatureInKelvin",
            "value": 6400
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "colorTemperature", "value": "DECREASE"}
      ]
    }
  },
  {
    description: "decrease color temperature dimmer item with increment parameter",
    directive: {
      "header": {
        "namespace": "Alexa.ColorTemperatureController",
        "name": "DecreaseColorTemperature"
      },
      "endpoint": {
        "endpointId": "gColorLight",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ColorTemperatureController": {
              "colorTemperatureInKelvin": {
                "parameters": {"increment": 10}, "item": {"name": "colorTemperature", "type": "Dimmer"},
                "schema": {"name": "colorTemperatureInKelvin"}}}
          })
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "colorTemperature", "state": "40", "type": "Dimmer"},
        {"name": "colorTemperature", "state": "50", "type": "Dimmer"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ColorTemperatureController",
            "name": "colorTemperatureInKelvin",
            "value": 5500
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "colorTemperature", "value": 50}
      ]
    }
  },
  {
    description: "decrease color temperature number item",
    directive: {
      "header": {
        "namespace": "Alexa.ColorTemperatureController",
        "name": "DecreaseColorTemperature"
      },
      "endpoint": {
        "endpointId": "gColorLight",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ColorTemperatureController": {
              "colorTemperatureInKelvin": {
                "parameters": {"increment": 900}, "item": {"name": "colorTemperature", "type": "Number"},
                "schema": {"name": "colorTemperatureInKelvin"}}}
          })
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "colorTemperature", "state": "6400", "type": "Number"},
        {"name": "colorTemperature", "state": "5500", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ColorTemperatureController",
            "name": "colorTemperatureInKelvin",
            "value": 5500
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "Response"
          },
        }
      },
      openhab: [
        {"name": "colorTemperature", "value": 5500}
      ]
    }
  },
  {
    description: "adjust color temperature in color mode error",
    directive: {
      "header": {
        "namespace": "Alexa.ColorTemperatureController",
        "name": "IncreaseColorTemperature"
      },
      "endpoint": {
        "endpointId": "gColorLight",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ColorController": {"color": {
              "parameters": {}, "item": {"name": "colorLight"}, "schema": {"name": "color"}}},
            "ColorTemperatureController": {
              "colorTemperatureInKelvin": {
                "parameters": {"increment": 900}, "item": {"name": "colorTemperature", "type": "Number"},
                "schema": {"name": "colorTemperatureInKelvin"}}}
          })
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "colorTemperature", "state": "0", "type": "Number"},
        {"name": "colorLight", "state": "180,50,50", "type": "Color"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "event": {
          "header": {
            "namespace": "Alexa.ColorTemperatureController",
            "name": "ErrorResponse"
          },
          "payload": {
            "type": "NOT_SUPPORTED_IN_CURRENT_MODE",
            "message": "The light is currently set to a color.",
            "currentDeviceMode": "COLOR"
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "report state color temperature in white mode",
    directive: {
      "header": {
        "namespace": "Alexa",
        "name": "ReportState"
      },
      "endpoint": {
        "endpointId": "gColorLight",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ColorController": {"color": {
              "parameters": {}, "item": {"name": "colorLight"}, "schema": {"name": "color"}}},
            "ColorTemperatureController": {
              "colorTemperatureInKelvin": {
                "parameters": {"increment": 900}, "item": {"name": "colorTemperature", "type": "Dimmer"},
                "schema": {"name": "colorTemperatureInKelvin"}}}
          })
        }
      }
    },
    mocked: {
      openhab: [
        {"name": "colorLight", "state": "0,0,100", "type": "Color"},
        {"name": "colorTemperature", "state": "50", "type": "Dimmer"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ColorTemperatureController",
            "name": "colorTemperatureInKelvin",
            "value": 5500
          }]
        },
        "event": {
          "header": {
            "namespace": "Alexa",
            "name": "StateReport"
          },
        }
      },
      openhab: []
    }
  }
];
