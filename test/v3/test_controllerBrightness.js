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
            "BrightnessController": {"brightness": {"parameters": {}, "item": {"name": "light1"}}}
          })
        }
      },
      "payload": {
        "brightness": 42
      }
    },
    mocked: {
      openhab: {"name": "light1", "state": "42", "type": "Dimmer"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.BrightnessController",
            "name": "brightness",
            "value": 42
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
        {"name": "light1", "value": 42}
      ]
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
            "BrightnessController": {"brightness": {"parameters": {}, "item": {"name": "light1"}}}
          })
        }
      },
      "payload": {
        "brightness": 42
      }
    },
    mocked: {
      openhab: {"name": "light1", "state": "0,0,42", "type": "Color"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.BrightnessController",
            "name": "brightness",
            "value": 42
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
        {"name": "light1", "value": 42}
      ]
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
            "BrightnessController": {"brightness": {"parameters": {}, "item": {"name": "light1"}}}
          })
        }
      },
      "payload": {
        "brightnessDelta": 3
      }
    },
    mocked: {
      openhab: [
        {"name": "light1", "state": "42", "type": "Dimmer"},
        {"name": "light1", "state": "45", "type": "Dimmer"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.BrightnessController",
            "name": "brightness",
            "value": 45
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
        {"name": "light1", "value": 45}
      ]
    }
  }
];
