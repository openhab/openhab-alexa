module.exports = [
  {
    description: "set volume",
    directive: {
      "header": {
        "namespace": "Alexa.Speaker",
        "name": "SetVolume"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "Speaker": {"volume": {"parameters": {}, "itemName": "speakerVolume"}}
          })
        }
      },
      "payload": {
        "volume": 50
      }
    },
    mocked: {
      openhab: {"name": "speakerVolume", "state": "50", "type": "Dimmer"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.Speaker",
            "name": "volume",
            "value": 50
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
        {"name": "speakerVolume", "value": 50}
      ]
    }
  },
  {
    description: "adjust volume default increment",
    directive: {
      "header": {
        "namespace": "Alexa.Speaker",
        "name": "AdjustVolume"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "Speaker": {"volume": {"parameters": {"increment": 5}, "itemName": "speakerVolume"}}
          })
        }
      },
      "payload": {
        "volume": -10,
        "volumeDefault": true
      }
    },
    mocked: {
      openhab: [
        {"name": "speakerVolume", "state": "50", "type": "Dimmer"},
        {"name": "speakerVolume", "state": "45", "type": "Dimmer"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.Speaker",
            "name": "volume",
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
        {"name": "speakerVolume", "value": 45}
      ]
    }
  },
  {
    description: "set mute volume",
    directive: {
      "header": {
        "namespace": "Alexa.Speaker",
        "name": "SetMute"
      },
      "endpoint": {
        "endpointId": "gSpeaker",
        "cookie": {
          "propertyMap": JSON.stringify({
            "Speaker": {"muted": {"parameters": {}, "itemName": "speakerMute"}}
          })
        }
      },
      "payload": {
        "mute": true
      }
    },
    mocked: {
      openhab: {"name": "speakerMute", "state": "ON", "type": "Switch"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.Speaker",
            "name": "muted",
            "value": true
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
        {"name": "speakerMute", "value": "ON"}
      ]
    }
  }
];
