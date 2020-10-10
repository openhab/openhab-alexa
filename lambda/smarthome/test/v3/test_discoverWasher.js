/**
 * Copyright (c) 2010-2020 Contributors to the openHAB project
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
  description: "washer mode components enabled group",
  mocked: [
    {
      "type": "String",
      "name": "WashCycle",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ModeController.mode",
          "config": {
            "supportedModes": "Normal=:Cottons,Delicate=@Value.Delicate:Knits,Whites",
            "friendlyNames": "Wash Cycle,Wash Setting"
          }
        }
      },
      "groupNames": ["gWasher"]
    },
    {
      "type": "Number",
      "name": "WashTemperature",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ModeController.mode",
          "config": {
            "supportedModes": "0=Cold:Cool,1=Warm,2=Hot",
            "friendlyNames": "Wash Temperature,@Setting.WaterTemperature",
            "ordered": true
          }
        }
      },
      "groupNames": ["gWasher"]
    },
    {
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
    },
    {
      "type": "String",
      "name": "WashStatus",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ModeController.mode",
          "config": {
            "supportedModes": "Washing=Lavage,Rinsing=Rincage,Spinning=Essorage",
            "friendlyNames": "État de Lavage",
            "nonControllable": true,
            "language": "fr"
          }
        }
      },
      "groupNames": ["gWasher"]
    },
    {
      "type": "String",
      "name": "InvalidMode",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "ModeController.mode"
        }
      },
      "groupNames": ["gWasher"]
    },
    {
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
  api: {
    "version": "3"
  },
  services: {
    "org.eclipse.smarthome.i18n": {
      "language": "en"
    }
  },
  expected: {
    "gWasher": {
      "capabilities": [
        "Alexa",
        "Alexa.ModeController.WashCycle.mode",
        "Alexa.ModeController.WashTemperature.mode",
        "Alexa.ModeController.WashSpinSpeed.mode",
        "Alexa.ModeController.WashStatus.mode",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["OTHER"],
      "friendlyName": "Washer",
      "resources": {
        "Alexa.ModeController.WashCycle": {
          "friendlyNames": [
            "text:Wash Cycle:en-AU", "text:Wash Cycle:en-CA", "text:Wash Cycle:en-GB",
            "text:Wash Cycle:en-IN", "text:Wash Cycle:en-US",
            "text:Wash Setting:en-AU", "text:Wash Setting:en-CA", "text:Wash Setting:en-GB",
            "text:Wash Setting:en-IN", "text:Wash Setting:en-US"
          ]
        },
        "Alexa.ModeController.WashTemperature": {
          "friendlyNames": [
            "text:Wash Temperature:en-AU", "text:Wash Temperature:en-CA", "text:Wash Temperature:en-GB",
            "text:Wash Temperature:en-IN", "text:Wash Temperature:en-US",
            "asset:Alexa.Setting.WaterTemperature"
          ]
        },
        "Alexa.ModeController.WashSpinSpeed": {
          "friendlyNames": [
            "text:Wash Spin Speed:en-AU", "text:Wash Spin Speed:en-CA", "text:Wash Spin Speed:en-GB",
            "text:Wash Spin Speed:en-IN", "text:Wash Spin Speed:en-US"
          ]
        },
        "Alexa.ModeController.WashStatus": {
          "friendlyNames": [
            "text:État de Lavage:fr-CA", "text:État de Lavage:fr-FR"
          ]
        }
      },
      "configuration": {
        "Alexa.ModeController.WashCycle": {
          "ordered": false,
          "supportedModes": {
            "Normal": {
              "friendlyNames": [
                "text:Normal:en-AU", "text:Normal:en-CA", "text:Normal:en-GB",
                "text:Normal:en-IN", "text:Normal:en-US",
                "text:Cottons:en-AU", "text:Cottons:en-CA", "text:Cottons:en-GB",
                "text:Cottons:en-IN", "text:Cottons:en-US"
              ]
            },
            "Delicate": {
              "friendlyNames": [
                "asset:Alexa.Value.Delicate",
                "text:Knits:en-AU", "text:Knits:en-CA", "text:Knits:en-GB",
                "text:Knits:en-IN", "text:Knits:en-US"
              ]
            },
            "Whites": {
              "friendlyNames": [
                "text:Whites:en-AU", "text:Whites:en-CA", "text:Whites:en-GB",
                "text:Whites:en-IN", "text:Whites:en-US"
              ]
            }
          }
        },
        "Alexa.ModeController.WashTemperature": {
          "ordered": true,
          "supportedModes": {
            "0": {
              "friendlyNames": [
                "text:Cold:en-AU", "text:Cold:en-CA", "text:Cold:en-GB",
                "text:Cold:en-IN", "text:Cold:en-US",
                "text:Cool:en-AU", "text:Cool:en-CA", "text:Cool:en-GB",
                "text:Cool:en-IN", "text:Cool:en-US"
              ]
            },
            "1": {
              "friendlyNames": [
                "text:Warm:en-AU", "text:Warm:en-CA", "text:Warm:en-GB",
                "text:Warm:en-IN", "text:Warm:en-US"
              ]
            },
            "2": {
              "friendlyNames": [
                "text:Hot:en-AU", "text:Hot:en-CA", "text:Hot:en-GB",
                "text:Hot:en-IN", "text:Hot:en-US"
              ]
            }
          }
        },
        "Alexa.ModeController.WashSpinSpeed": {
          "ordered": false,
          "supportedModes": {
            "off": {
              "friendlyNames": [
                "text:No Spin:en-AU", "text:No Spin:en-CA", "text:No Spin:en-GB",
                "text:No Spin:en-IN", "text:No Spin:en-US"
              ]
            },
            "low": {
              "friendlyNames": [
                "text:Low:en-AU", "text:Low:en-CA", "text:Low:en-GB",
                "text:Low:en-IN", "text:Low:en-US"
              ]
            },
            "medium": {
              "friendlyNames": [
                "text:Medium:en-AU", "text:Medium:en-CA", "text:Medium:en-GB",
                "text:Medium:en-IN", "text:Medium:en-US"
              ]
            },
            "high": {
              "friendlyNames": [
                "text:High:en-AU", "text:High:en-CA", "text:High:en-GB",
                "text:High:en-IN", "text:High:en-US"
              ]
            }
          }
        },
        "Alexa.ModeController.WashStatus": {
          "ordered": false,
          "supportedModes": {
            "Washing": {
              "friendlyNames": [
                "text:Lavage:fr-CA", "text:Lavage:fr-FR"
              ]
            },
            "Rinsing": {
              "friendlyNames": [
                "text:Rincage:fr-CA", "text:Rincage:fr-FR"
              ]
            },
            "Spinning": {
              "friendlyNames": [
                "text:Essorage:fr-CA", "text:Essorage:fr-FR"
              ]
            }
          }
        }
      },
      "propertyMap": {
        "ModeController:WashCycle": {
          "mode": {
            "parameters": {
              "supportedModes": ["Normal=Normal:Cottons", "Delicate=@Value.Delicate:Knits", "Whites=Whites"],
              "friendlyNames": ["Wash Cycle", "Wash Setting"]},
            "item": {"name": "WashCycle", "type": "String"},
            "schema": {"name": "mode"}
          }
        },
        "ModeController:WashTemperature": {
          "mode": {
            "parameters": {
              "supportedModes": ["0=Cold:Cool", "1=Warm", "2=Hot"], "ordered": true,
              "friendlyNames": ["Wash Temperature", "@Setting.WaterTemperature"]},
            "item": {"name": "WashTemperature", "type": "Number"},
            "schema": {"name": "mode"}
          }
        },
        "ModeController:WashSpinSpeed": {
          "mode": {
            "parameters": {
              "supportedModes": ["off=No Spin", "low=Low", "medium=Medium", "high=High"],
              "friendlyNames": ["Wash Spin Speed"]},
            "item": {"name": "WashSpinSpeed", "type": "String"},
            "schema": {"name": "mode"}
          }
        },
        "ModeController:WashStatus": {
          "mode": {
            "parameters": {
              "supportedModes": ["Washing=Lavage", "Rinsing=Rincage", "Spinning=Essorage"],
              "friendlyNames": ["État de Lavage"], "nonControllable": true, "language": "fr"},
            "item": {"name": "WashStatus", "type": "String"},
            "schema": {"name": "mode"}
          }
        }
      }
    }
  }
};
