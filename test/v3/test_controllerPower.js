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
            "PowerController": {
              "powerState": {"parameters": {}, "item": {"name": "light1"}, "schema": {"name": "powerState"}}}
          })
        }
      },
    },
    mocked: {
      openhab: {"name": "light1", "state": "ON", "type": "Switch"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PowerController",
            "name": "powerState",
            "value": "ON"
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
        {"name": "light1", "value": "ON"}
      ]
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
            "PowerController": {
              "powerState": {"parameters": {}, "item": {"name": "light1"}, "schema": {"name": "powerState"}}}
          })
        }
      },
    },
    mocked: {
      openhab: {"name": "light1", "state": "100", "type": "Dimmer", "stateDescription": {"pattern": ">%d%<"}}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PowerController",
            "name": "powerState",
            "value": "ON"
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
        {"name": "light1", "value": "ON"}
      ]
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
            "PowerController": {
              "powerState": {"parameters": {}, "item": {"name": "light1"}, "schema": {"name": "powerState"}}}
          })
        }
      },
    },
    mocked: {
      openhab: {"name": "light1", "state": "0,0,0", "type": "Color"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.PowerController",
            "name": "powerState",
            "value": "OFF"
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
        {"name": "light1", "value": "OFF"}
      ]
    }
  }
];
