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
            "MotionSensor": {
              "detectionState": {
                "parameters": {}, "item": {"name": "motion1", "type": "Switch"},
                "schema": {"name": "detectionState"}}}
          })
        }
      }
    },
    mocked: {
      openhab: {"name": "motion1", "state": "OFF", "type": "Switch"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [
            {
              "namespace": "Alexa.MotionSensor",
              "name": "detectionState",
              "value": "NOT_DETECTED"
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
