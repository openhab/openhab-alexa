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
            "ColorTemperatureController": {"colorTemperatureInKelvin": {"parameters": {}, "itemName": "colorTemperature"}}
          })
        }
      },
      "payload": {
        "colorTemperatureInKelvin": 5500
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.ColorTemperatureController",
              "name": "colorTemperatureInKelvin",
              "value": 5500
            }]
          },
          "event": {
            "header": {
              "namespace":"Alexa",
              "name": "Response"
            },
          }
        }
      },
      "openhab": {
        "commands": [{"name": "colorTemperature", "value": 50}],
        "input": {"staged": false, "values": {"name": "colorTemperature", "state": "50", "type": "Dimmer"}}
      }
    },
  },
  {
    description: "increase color temperature dimmer item",
    directive: {
      "header": {
        "namespace": "Alexa.ColorTemperatureController",
        "name": "IncreaseColorTemperature"
      },
      "endpoint": {
        "endpointId": "gColorLight",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ColorTemperatureController": {"colorTemperatureInKelvin": {"parameters": {"increment": 900}, "itemName": "colorTemperature"}}
          })
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.ColorTemperatureController",
              "name": "colorTemperatureInKelvin",
              "value": 6400
            }]
          },
          "event": {
            "header": {
              "namespace":"Alexa",
              "name": "Response"
            },
          }
        }
      },
      "openhab": {
        "commands": [{"name": "colorTemperature", "value": "DECREASE"}],
        "input": {"staged": true, "values": [
          {"name": "colorTemperature", "state": "50", "type": "Dimmer"},
          {"name": "colorTemperature", "state": "40", "type": "Dimmer"}
        ]}
      }
    },
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
            "ColorTemperatureController": {"colorTemperatureInKelvin": {"parameters": {"increment": 900}, "itemName": "colorTemperature"}}
          })
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.ColorTemperatureController",
              "name": "colorTemperatureInKelvin",
              "value": 5500
            }]
          },
          "event": {
            "header": {
              "namespace":"Alexa",
              "name": "Response"
            },
          }
        }
      },
      "openhab": {
        "commands": [{"name": "colorTemperature", "value": 5500}],
        "input": {"staged": true, "values": [
          {"name": "colorTemperature", "state": "6400", "type": "Number"},
          {"name": "colorTemperature", "state": "5500", "type": "Number"}
        ]}
      }
    },
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
            "ColorController": {"color": {"parameters": {}, "itemName": "colorLight"}},
            "ColorTemperatureController": {"colorTemperatureInKelvin": {"parameters": {"increment": 900}, "itemName": "colorTemperature"}}
          })
        }
      }
    },
    expected: {
      "alexa": {
        "response": {
          "event": {
            "header": {
              "namespace":"Alexa",
              "name": "ErrorResponse"
            },
            "payload": {
              type: "NOT_SUPPORTED_IN_CURRENT_MODE",
              message: "The light is currently set to a color.",
              currentDeviceMode: "COLOR"
            }
          }
        }
      },
      "openhab": {
        "commands": [],
        "input": {"staged": false, "values": {"name": "colorTemperature", "state": "0", "type": "Number"}}
      }
    },
  }
];
