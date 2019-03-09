module.exports = {
  description: "fan range/toggle components",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/TowerFanSpeed",
          "type": "Number",
          "name": "TowerFanSpeed",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "RangeController.rangeValue",
              "config": {
                "supportedRange": "1:10:1",
                "presets": "1=@Value.Minimum:@Value.Low:Lowest,10=@Value.Maximum:@Value.High:Highest,99=invalid",
                "friendlyNames": "@Setting.FanSpeed,Air Speed,Speed"
              }
            }
          },
          "groupNames": ["gTowerFan"]
        },
        {
          "link": "https://myopenhab.org/rest/items/TowerFanOscillate",
          "type": "Switch",
          "name": "TowerFanOscillate",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ToggleController.toggleState",
              "config": {
                "friendlyNames": "@Setting.Oscillate,Rotate"
              }
            }
          },
          "groupNames": ["gTowerFan"]
        },
        {
          "link": "https://myopenhab.org/rest/items/TowerFanAngle",
          "state": "80 °",
          "type": "Number:Angle",
          "name": "TowerFanAngle",
          "label": "Fan Angle",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "RangeController.rangeValue",
              "config": {
                "supportedRange": "0:120:20"
              }
            }
          },
          "groupNames": ["gTowerFan"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gTowerFan",
      "type": "Group",
      "name": "gTowerFan",
      "label": "Tower Fan",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.Other"
        }
      },
      "groupNames": []
    }
  ],
  expected: {
    "gTowerFan": {
      "capabilities": [
        "Alexa",
        "Alexa.RangeController.TowerFanAngle.rangeValue",
        "Alexa.RangeController.TowerFanSpeed.rangeValue",
        "Alexa.ToggleController.TowerFanOscillate.toggleState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["OTHER"],
      "friendlyName": "Tower Fan",
      "resources": {
        "Alexa.RangeController.TowerFanAngle": {
          "friendlyNames": ["text:Fan Angle:en-US"]
        },
        "Alexa.RangeController.TowerFanSpeed": {
          "friendlyNames": ["asset:Alexa.Setting.FanSpeed", "text:Air Speed:en-US", "text:Speed:en-US"]
        },
        "Alexa.ToggleController.TowerFanOscillate": {
          "friendlyNames": ["asset:Alexa.Setting.Oscillate", "text:Rotate:en-US"]
        }
      },
      "configuration": {
        "Alexa.RangeController.TowerFanAngle": {
          "supportedRange": {"minimumValue": 0, "maximumValue": 120, "precision": 20},
          "unitOfMeasure": "Alexa.Unit.Angle.Degrees"
        },
        "Alexa.RangeController.TowerFanSpeed": {
          "supportedRange": {"minimumValue": 1, "maximumValue": 10, "precision": 1},
          "presets": {
            1: {
              "friendlyNames": ["asset:Alexa.Value.Minimum", "asset:Alexa.Value.Low", "text:Lowest:en-US"]
            },
            10: {
              "friendlyNames": ["asset:Alexa.Value.Maximum", "asset:Alexa.Value.High", "text:Highest:en-US"]
            }
          }
        }
      },
      "propertyMap": {
        "RangeController:TowerFanAngle": {
          "rangeValue": {
            "parameters": {
              "supportedRange": {"minimumValue": 0, "maximumValue": 120, "precision": 20},
              "unitOfMeasure": "Angle.Degrees",
              "friendlyNames": ["Fan Angle"]
            },
            "item": {"name": "TowerFanAngle", "type": "Number:Angle"},
            "schema": {"name": "rangeValue"}
          }
        },
        "RangeController:TowerFanSpeed": {
          "rangeValue": {
            "parameters": {
              "supportedRange": {"minimumValue": 1, "maximumValue": 10, "precision": 1},
              "presets": ["1=@Value.Minimum:@Value.Low:Lowest", "10=@Value.Maximum:@Value.High:Highest"],
              "friendlyNames": ["@Setting.FanSpeed", "Air Speed", "Speed"]
            },
            "item": {"name": "TowerFanSpeed", "type": "Number"},
            "schema": {"name": "rangeValue"}
          }
        },
        "ToggleController:TowerFanOscillate": {
          "toggleState": {
            "parameters": {"friendlyNames": ["@Setting.Oscillate", "Rotate"]},
            "item": {"name": "TowerFanOscillate", "type": "Switch"},
            "schema": {"name": "toggleState"}
          }
        }
      }
    }
  }
};
