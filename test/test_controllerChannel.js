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
            "ChannelController": {"channel": {"parameters": {}, "itemName": "gTelevision"}}
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
    expected: {
      "alexa": {
        "response": {
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
              "namespace":"Alexa",
              "name": "Response"
            },
          }
        }
      },
      "openhab": {
        "commands": [{"name": "gTelevision", "value": "1234"}],
        "input": {"staged": false, "values": {"name": "gTelevision", "state": "1234", "type": "Number"}}
      }
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
            "ChannelController": {"channel": {"parameters": {}, "itemName": "gTelevision"}}
          })
        }
      },
      "payload": {
        "channelCount": -4
      }
    },
    expected: {
      "alexa": {
        "response": {
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
              "namespace":"Alexa",
              "name": "Response"
            },
          }
        }
      },
      "openhab": {
        "commands": [{"name": "gTelevision", "value": "1230"}],
        "input": {"staged": true, "values": [
          {"name": "gTelevision", "state": "1234", "type": "Number"},
          {"name": "gTelevision", "state": "1230", "type": "Number"}
        ]}
      }
    }
  }
];
