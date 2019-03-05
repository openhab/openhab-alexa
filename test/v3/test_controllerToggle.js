module.exports = [
  {
    description: "turn on toggle state",
    directive: {
      "header": {
        "namespace": "Alexa.ToggleController",
        "name": "TurnOn",
        "instance": "TowerFan"
      },
      "endpoint": {
        "endpointId": "TowerFan",
        "cookie": {
          "propertyMap": JSON.stringify({
            "ToggleController:TowerFan": {
              "toggleState": {
                "parameters": {"friendlyNames": ["assetId:Setting.Oscillate", "Rotate"]},
                "item": {"name": "TowerFan", "type": "Switch"}, "schema": {"name": "toggleState"}}}
          })
        }
      },
    },
    mocked: {
      openhab: {"name": "TowerFan", "state": "ON", "type": "Switch"}
    },
    expected: {
      alexa: {
        "context": {
          "properties": [{
            "namespace": "Alexa.ToggleController",
            "name": "toggleState",
            "instance": "TowerFan",
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
        {"name": "TowerFan", "value": "ON"}
      ]
    }
  }
];
