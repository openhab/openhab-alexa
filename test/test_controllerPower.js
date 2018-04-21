module.exports = [
  {
    description: "turn on power switch item",
    directive: {
      "header": {
        "namespace": "Alexa.PowerController",
        "name": "TurnOn"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerController": {"powerState": {"parameters": {}, "itemName": "light1"}}
          })
        }
      },
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.PowerController",
              "name": "powerState",
              "value": "ON"
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
        "commands": [{"name": "light1", "value": "ON"}],
        "input": {"staged": false, "values": {"name": "light1", "state": "ON", "type": "Switch"}}
      }
    }
  },
  {
    description: "turn on power dimmer item",
    directive: {
      "header": {
        "namespace": "Alexa.PowerController",
        "name": "TurnOn"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerController": {"powerState": {"parameters": {}, "itemName": "light1"}}
          })
        }
      },
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.PowerController",
              "name": "powerState",
              "value": "ON"
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
        "commands": [{"name": "light1", "value": "ON"}],
        "input": {"staged": false, "values": {"name": "light1", "state": "100", "type": "Dimmer"}}
      }
    }
  },
  {
    description: "turn off power color item",
    directive: {
      "header": {
        "namespace": "Alexa.PowerController",
        "name": "TurnOff"
      },
      "endpoint": {
        "endpointId": "light1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "PowerController": {"powerState": {"parameters": {}, "itemName": "light1"}}
          })
        }
      },
    },
    expected: {
      "alexa": {
        "response": {
          "context": {
            "properties": [{
              "namespace": "Alexa.PowerController",
              "name": "powerState",
              "value": "OFF"
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
        "commands": [{"name": "light1", "value": "OFF"}],
        "input": {"staged": false, "values": {"name": "light1", "state": "0,0,0", "type": "Color"}}
      }
    }
  }
];
