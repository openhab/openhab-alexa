/**
 * Copyright (c) 2010-2019 Contributors to the openHAB project
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */

module.exports = {
  description: "fan range/toggle components",
  mocked: [
    {
      "type": "Dimmer",
      "name": "TowerFanSpeed",
      "stateDescription": {
        "pattern": "%d %%"
      },
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "RangeController.rangeValue",
          "config": {
            "supportedRange": "0:100:10",
            "presets": "10=@Value.Minimum:@Value.Low:Lowest,100=@Value.Maximum:@Value.High:Highest,999=invalid",
            "friendlyNames": "@Setting.FanSpeed,Air Speed"
          }
        }
      },
      "groupNames": ["gTowerFan"]
    },
    {
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
        },
        "synonyms": {
          "value": "Orientation"
        }
      },
      "groupNames": ["gTowerFan"]
    },
    {
      "type": "Group",
      "name": "gTowerFan",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.Fan"
        },
        "synonyms": {
          "value": "Tower Fan,Floor Fan"
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
      "displayCategories": ["FAN"],
      "friendlyName": "Tower Fan",
      "resources": {
        "Alexa.RangeController.TowerFanAngle": {
          "friendlyNames": [
            "text:Fan Angle:en-AU", "text:Fan Angle:en-CA", "text:Fan Angle:en-GB",
            "text:Fan Angle:en-IN", "text:Fan Angle:en-US",
            "text:Orientation:en-AU", "text:Orientation:en-CA", "text:Orientation:en-GB",
            "text:Orientation:en-IN", "text:Orientation:en-US"
          ]
        },
        "Alexa.RangeController.TowerFanSpeed": {
          "friendlyNames": [
            "asset:Alexa.Setting.FanSpeed",
            "text:Air Speed:en-AU", "text:Air Speed:en-CA", "text:Air Speed:en-GB",
            "text:Air Speed:en-IN", "text:Air Speed:en-US"
          ]
        },
        "Alexa.ToggleController.TowerFanOscillate": {
          "friendlyNames": [
            "asset:Alexa.Setting.Oscillate",
            "text:Rotate:en-AU", "text:Rotate:en-CA", "text:Rotate:en-GB",
            "text:Rotate:en-IN", "text:Rotate:en-US"
          ]
        }
      },
      "configuration": {
        "Alexa.RangeController.TowerFanAngle": {
          "supportedRange": {"minimumValue": 0, "maximumValue": 120, "precision": 20},
          "unitOfMeasure": "Alexa.Unit.Angle.Degrees"
        },
        "Alexa.RangeController.TowerFanSpeed": {
          "supportedRange": {"minimumValue": 0, "maximumValue": 100, "precision": 10},
          "unitOfMeasure": "Alexa.Unit.Percent",
          "presets": {
            10: {
              "friendlyNames": [
                "asset:Alexa.Value.Minimum", "asset:Alexa.Value.Low",
                "text:Lowest:en-AU", "text:Lowest:en-CA", "text:Lowest:en-GB",
                "text:Lowest:en-IN", "text:Lowest:en-US"
              ]
            },
            100: {
              "friendlyNames": [
                "asset:Alexa.Value.Maximum", "asset:Alexa.Value.High",
                "text:Highest:en-AU", "text:Highest:en-CA", "text:Highest:en-GB",
                "text:Highest:en-IN", "text:Highest:en-US"
              ]
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
              "friendlyNames": ["Fan Angle", "Orientation"]
            },
            "item": {"name": "TowerFanAngle", "type": "Number:Angle"},
            "schema": {"name": "rangeValue"}
          }
        },
        "RangeController:TowerFanSpeed": {
          "rangeValue": {
            "parameters": {
              "supportedRange": {"minimumValue": 0, "maximumValue": 100, "precision": 10},
              "unitOfMeasure": "Percent",
              "presets": ["10=@Value.Minimum:@Value.Low:Lowest", "100=@Value.Maximum:@Value.High:Highest"],
              "friendlyNames": ["@Setting.FanSpeed", "Air Speed"]
            },
            "item": {"name": "TowerFanSpeed", "type": "Dimmer"},
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
