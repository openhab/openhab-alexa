module.exports = {
  description: "washer mode components enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/WashCycle",
          "type": "String",
          "name": "WashCycle",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ModeController.mode",
              "config": {
                "supportedModes": "Normal:Cottons,Delicates:Knites",
                "friendlyNames": "Wash Cycle,Wash Setting"
              }
            }
          },
          "groupNames": ["gWasher"]
        },
        {
          "link": "https://myopenhab.org/rest/items/WashTemperature",
          "type": "Number",
          "name": "WashTemperature",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ModeController.mode",
              "config": {
                "Cold": 0,
                "Warm": 1,
                "Hot": 2,
                "supportedModes": "Cold:Cool,Warm,Hot",
                "friendlyNames": "Wash Temperature,assetId:Setting.WaterTemperature",
                "ordered": true
              }
            }
          },
          "groupNames": ["gWasher"]
        },
        {
          "link": "https://myopenhab.org/rest/items/WashSpinSpeed",
          "stateDescription": {
            "options": [
              {"value": "off", "label": "No Spin"},
              {"value": "low", "label": "Low"},
              {"value": "medium", "label": "Medium"},
              {"value": "high", "label": "High"},
            ]
          },
          "type": "String",
          "name": "WashSpinSpeed",
          "label": "Wash Spin Speed",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "ModeController.mode"
            }
          },
          "groupNames": ["gWasher"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gWasher",
      "type": "Group",
      "name": "gWasher",
      "label": "Washer",
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
    "gWasher": {
      "capabilities": [
        "Alexa",
        "Alexa.ModeController.WashCycle.mode",
        "Alexa.ModeController.WashTemperature.mode",
        "Alexa.ModeController.WashSpinSpeed.mode",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["OTHER"],
      "friendlyName": "Washer",
      "resources": {
        "Alexa.ModeController.WashCycle": {
          "friendlyNames": ["text:Wash Cycle:en-US", "text:Wash Setting:en-US"]
        },
        "Alexa.ModeController.WashTemperature": {
          "friendlyNames": ["text:Wash Temperature:en-US", "asset:Alexa.Setting.WaterTemperature"]
        },
        "Alexa.ModeController.WashSpinSpeed": {
          "friendlyNames": ["text:Wash Spin Speed:en-US"]
        }
      },
      "configuration": {
        "Alexa.ModeController.WashCycle": {
          "ordered": false,
          "supportedModes": {
            "Normal": {
              "friendlyNames": ["text:Normal:en-US", "text:Cottons:en-US"]
            },
            "Delicates": {
              'friendlyNames': ["text:Delicates:en-US", "text:Knites:en-US"]
            }
          }
        },
        "Alexa.ModeController.WashTemperature": {
          "ordered": true,
          "supportedModes": {
            "Cold": {
              "friendlyNames": ["text:Cold:en-US", "text:Cool:en-US"]
            },
            "Warm": {
              'friendlyNames': ["text:Warm:en-US"]
            },
            "Hot": {
              'friendlyNames': ["text:Hot:en-US"]
            }
          }
        },
        "Alexa.ModeController.WashSpinSpeed": {
          "ordered": false,
          "supportedModes": {
            "No Spin": {
              'friendlyNames': ["text:No Spin:en-US"]
            },
            "Low": {
              'friendlyNames': ["text:Low:en-US"]
            },
            "Medium": {
              'friendlyNames': ["text:Medium:en-US"]
            },
            "High": {
              "friendlyNames": ["text:High:en-US"]
            }
          }
        }
      },
      "propertyMap": {
        "ModeController:WashSpinSpeed": {
          "mode": {
            "parameters": {
              "No Spin": "off", "Low": "low", "Medium": "medium", "High": "high",
              "supportedModes": ["No Spin", "Low", "Medium", "High"],
              "friendlyNames": ["Wash Spin Speed"]},
            "item": {"name": "WashSpinSpeed", "type": "String"},
            "schema": {"name": "mode"}
          }
        }
      }
    }
  }
};
