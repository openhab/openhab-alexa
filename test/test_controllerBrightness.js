module.exports = [
  {
    description: "set brightness dimmer item",
    directive: {
      "header": {
        "namespace": "Alexa.BrightnessController",
        "name": "SetBrightness"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "BrightnessController": {"brightness": {"parameters": {}, "itemName": "light1"}}
          })
        }
      },
      "payload": {
        "brightness": 42
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.BrightnessController",
              "name": "brightness",
              "value": 42
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
        "commands": [{"name": "light1", "value": 42}],
        "input": {"staged": false, "values": {"name": "light1", "state": "42", "type": "Dimmer"}}
      }
    }
  },
  {
    description: "set brightness color item",
    directive: {
      "header": {
        "namespace": "Alexa.BrightnessController",
        "name": "SetBrightness"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "BrightnessController": {"brightness": {"parameters": {}, "itemName": "light1"}}
          })
        }
      },
      "payload": {
        "brightness": 42
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.BrightnessController",
              "name": "brightness",
              "value": 42
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
        "commands": [{"name": "light1", "value": 42}],
        "input": {"staged": false, "values": {"name": "light1", "state": "0,0,42", "type": "Color"}}
      }
    }
  },
  {
    description: "adjust brightness",
    directive: {
      "header": {
        "namespace": "Alexa.BrightnessController",
        "name": "AdjustBrightness"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "BrightnessController": {"brightness": {"parameters": {}, "itemName": "light1"}}
          })
        }
      },
      "payload": {
        "brightnessDelta": 3
      }
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.BrightnessController",
              "name": "brightness",
              "value": 45
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
        "commands": [{"name": "light1", "value": 45}],
        "input": {"staged": true, "values": [
          {"name": "light1", "state": "42", "type": "Dimmer"},
          {"name": "light1", "state": "45", "type": "Dimmer"},
        ]}
      }
    }
  }
];
