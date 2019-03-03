module.exports = [
  {
    description: "change channel",
    directive: {
      "header": {
        "namespace": "Alexa.ChannelController",
        "name": "ChangeChannel"
      },
      "endpoint": {
        "endpointId": "gTelevision",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ChannelController": {
              "channel": {"parameters": {}, "item": {"name": "gTelevision"}, "schema": {"name": "channel"}}}
          })
        }
      },
      "payload": {
        "channel": {
          "number": "1234",
          "callSign": "KSTATION1",
          "affiliateCallSign": "KSTATION2",
          "uri": "someUrl"
        },
        "channelMetadata": {
          "name": "Alternate Channel Name",
          "image": "urlToImage"
        }
      }
    },
    mocked: {
      openhab: {"name": "gTelevision", "state": "1234", "type": "Number"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ChannelController",
            "name": "channel",
            "value": {
              "number": "1234"
            }
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
        {"name": "gTelevision", "value": "1234"}
      ]
    }
  },
  {
    description: "change channel by name",
    directive: {
      "header": {
        "namespace": "Alexa.ChannelController",
        "name": "ChangeChannel"
      },
      "endpoint": {
        "endpointId": "gTelevision",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ChannelController": {
              "channel": {
                "parameters": {"FOO": 12, "BAR": 34, "BAZ": 56, "QUX": 78},
                "item": {"name": "gTelevision"}, "schema": {"name": "channel"}}}
          })
        }
      },
      "payload": {
        "channel": {},
        "channelMetadata": {
          "name": "BAZ"
        }
      }
    },
    mocked: {
      openhab: {"name": "gTelevision", "state": "56", "type": "Number"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ChannelController",
            "name": "channel",
            "value": {
              "number": "56"
            }
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
        {"name": "gTelevision", "value": 56}
      ]
    }
  },
  {
    description: "change channel invalid value",
    directive: {
      "header": {
        "namespace": "Alexa.ChannelController",
        "name": "ChangeChannel"
      },
      "endpoint": {
        "endpointId": "gTelevision",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ChannelController": {
              "channel": {
                "parameters": {"FOO": 12, "BAR": 34},
                "item": {"name": "gTelevision"}, "schema": {"name": "channel"}}}
          })
        }
      },
      "payload": {
        "channel": {},
        "channelMetadata": {
          "name": "BAZ"
        }
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
            type: "INVALID_VALUE",
            message: "Invalid channel",
          }
        }
      },
      openhab: []
    }
  },
  {
    description: "skip channel",
    directive: {
      "header": {
        "namespace": "Alexa.ChannelController",
        "name": "SkipChannels"
      },
      "endpoint": {
        "endpointId": "gTelevision",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ChannelController": {
              "channel": {"parameters": {}, "item": {"name": "gTelevision"}, "schema": {"name": "channel"}}}
          })
        }
      },
      "payload": {
        "channelCount": -4
      }
    },
    mocked: {
      openhab: [
        {"name": "gTelevision", "state": "1234", "type": "Number"},
        {"name": "gTelevision", "state": "1230", "type": "Number"}
      ],
      staged: true
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ChannelController",
            "name": "channel",
            "value": {
              "number": "1230"
            }
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
        {"name": "gTelevision", "value": 1230}
      ]
    }
  }
];
