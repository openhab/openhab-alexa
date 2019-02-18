module.exports = [
  {
    description: "report state motion sensor",
    directive: {
      "header": {
        "namespace": "Alexa",
        "name": "ReportState"
      },
      "endpoint": {
        "endpointId": "motion1",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ContactSensor": {
              "detectionState": {
                "parameters": {}, "item": {"name": "motion1", "type": "Contact"}}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "motion1", "state": "OPEN", "type": "Contact"}
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
