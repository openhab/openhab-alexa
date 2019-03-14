module.exports = [
  {
    description: "report state contact sensor",
    directive: {
      "header": {
        "namespace": "Alexa",
        "name": "ReportState"
      },
      "endpoint": {
        "endpointId": "contact1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ContactSensor": {
              "detectionState": {
                "parameters": {}, "item": {"name": "contact1", "type": "Contact"},
                "schema": {"name": "detectionState"}}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "contact1", "state": "OPEN", "type": "Contact"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.ContactSensor",
              "name": "detectionState",
              "value": "DETECTED"
            }
          ]
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
