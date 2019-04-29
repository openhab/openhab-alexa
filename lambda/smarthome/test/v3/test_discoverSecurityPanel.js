module.exports = {
  description: "security panel enabled group",
  mocked: [
    {
      "members": [
        {
          "link": "https://myopenhab.org/rest/items/ArmState",
          "type": "String",
          "name": "ArmState",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "SecurityPanelController.armState",
              "config": {
                "exitDelay": 180,
                "supportedArmStates": "ARMED_AWAY,ARMED_STAY,DISARMED",
                "supportsArmInstant": true,
                "supportsPinCodes": true
              }
            }
          },
          "groupNames": ["gAlarmSystem"]
        },
        {
          "link": "https://myopenhab.org/rest/items/BurglaryAlarm",
          "type": "Switch",
          "name": "BurglaryAlarm",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "SecurityPanelController.burglaryAlarm"
            }
          },
          "groupNames": ["gAlarmSystem"]
        },
        {
          "link": "https://myopenhab.org/rest/items/FireAlarm",
          "type": "Switch",
          "name": "FireAlarm",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "SecurityPanelController.fireAlarm"
            }
          },
          "groupNames": ["gAlarmSystem"]
        },
        {
          "link": "https://myopenhab.org/rest/items/CarbonMonoxideAlarm",
          "type": "Switch",
          "name": "CarbonMonoxideAlarm",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "SecurityPanelController.carbonMonoxideAlarm"
            }
          },
          "groupNames": ["gAlarmSystem"]
        },
        {
          "link": "https://myopenhab.org/rest/items/WaterAlarm",
          "type": "Switch",
          "name": "WaterAlarm",
          "tags": [],
          "metadata": {
            "alexa": {
              "value": "SecurityPanelController.waterAlarm"
            }
          },
          "groupNames": ["gAlarmSystem"]
        }
      ],
      "link": "https://myopenhab.org/rest/items/gAlarmSystem",
      "type": "Group",
      "name": "gAlarmSystem",
      "label": "Alarm System",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "Endpoint.SecurityPanel"
        }
      },
      "groupNames": []
    },
    { // Number item type state mapping no supportedArmStates
      "link": "https://myopenhab.org/rest/items/AlarmMode1",
      "type": "Number",
      "name": "AlarmMode1",
      "label": "Alarm Mode",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "SecurityPanelController.armState",
          "config": {
            "DISARMED": 0,
            "ARMED_STAY": 1,
            "ARMED_AWAY": 2,
            "exitDelay": 300,
            "supportsArmInstant": true,
            "supportsPinCodes": true
          }
        }
      },
      "groupNames": []
    },
    { // Switch item type default config
      "link": "https://myopenhab.org/rest/items/AlarmMode2",
      "type": "Switch",
      "name": "AlarmMode2",
      "label": "Alarm Mode",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "SecurityPanelController.armState",
        }
      },
      "groupNames": []
    },
    { // No exit delay arm instant enabled
      "link": "https://myopenhab.org/rest/items/AlarmMode3",
      "type": "String",
      "name": "AlarmMode3",
      "label": "Alarm Mode",
      "tags": [],
      "metadata": {
        "alexa": {
          "value": "SecurityPanelController.armState",
          "config": {
            "supportedArmStates": "ARMED_AWAY,ARMED_STAY,DISARMED",
            "supportsArmInstant": true
          }
        }
      },
      "groupNames": []
    }
  ],
  expected: {
    "gAlarmSystem": {
      "capabilities": [
        "Alexa",
        "Alexa.SecurityPanelController.armState",
        "Alexa.SecurityPanelController.burglaryAlarm",
        "Alexa.SecurityPanelController.fireAlarm",
        "Alexa.SecurityPanelController.carbonMonoxideAlarm",
        "Alexa.SecurityPanelController.waterAlarm",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SECURITY_PANEL"],
      "friendlyName": "Alarm System",
      "configuration": {
        "Alexa.SecurityPanelController": {
          "supportsArmInstant": true,
          "supportedArmStates": [
            {'value': 'ARMED_AWAY'}, {'value': 'ARMED_STAY'}, {'value': 'DISARMED'}
          ],
          "supportedAuthorizationTypes": [
            {'type': 'FOUR_DIGIT_PIN'}
          ]
        }
      },
      "propertyMap": {
        "SecurityPanelController": {
          "armState": {
            "parameters": {
              "supportedArmStates": ["ARMED_AWAY", "ARMED_STAY", "DISARMED"],
              "supportsArmInstant": true, "supportsPinCodes": true, "exitDelay": 180},
            "item": {"name": "ArmState", "type": "String"},
            "schema": {"name": "armState"}
          },
          "burglaryAlarm": {
            "parameters": {},
            "item": {"name": "BurglaryAlarm", "type": "Switch"},
            "schema": {"name": "alarmState"}
          },
          "fireAlarm": {
            "parameters": {},
            "item": {"name": "FireAlarm", "type": "Switch"},
            "schema": {"name": "alarmState"}
          },
          "carbonMonoxideAlarm": {
            "parameters": {},
            "item": {"name": "CarbonMonoxideAlarm", "type": "Switch"},
            "schema": {"name": "alarmState"}
          },
          "waterAlarm": {
            "parameters": {},
            "item": {"name": "WaterAlarm", "type": "Switch"},
            "schema": {"name": "alarmState"}
          }
        }
      }
    },
    "AlarmMode1": {
      "capabilities": [
        "Alexa",
        "Alexa.SecurityPanelController.armState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SECURITY_PANEL"],
      "friendlyName": "Alarm Mode",
      "configuration": {
        "Alexa.SecurityPanelController": {
          "supportsArmInstant": false,
          "supportedArmStates": [
            {'value': 'DISARMED'}, {'value': 'ARMED_STAY'}, {'value': 'ARMED_AWAY'}
          ]
        }
      },
      "propertyMap": {
        "SecurityPanelController": {
          "armState": {
            "parameters": {
              "DISARMED": 0, "ARMED_STAY": 1, "ARMED_AWAY": 2, "exitDelay": 255,
              "supportedArmStates": ["DISARMED", "ARMED_STAY", "ARMED_AWAY"]},
            "item": {"name": "AlarmMode1", "type": "Number"},
            "schema": {"name": "armState"}
          }
        }
      }
    },
    "AlarmMode2": {
      "capabilities": [
        "Alexa",
        "Alexa.SecurityPanelController.armState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SECURITY_PANEL"],
      "friendlyName": "Alarm Mode",
      "configuration": {
        "Alexa.SecurityPanelController": {
          "supportsArmInstant": false,
          "supportedArmStates": [
            {'value': 'DISARMED'}, {'value': 'ARMED_STAY'}
          ]
        }
      },
      "propertyMap": {
        "SecurityPanelController": {
          "armState": {
            "parameters": {
              "supportedArmStates": ["DISARMED", "ARMED_STAY"]},
            "item": {"name": "AlarmMode2", "type": "Switch"},
            "schema": {"name": "armState"}
          }
        }
      }
    },
    "AlarmMode3": {
      "capabilities": [
        "Alexa",
        "Alexa.SecurityPanelController.armState",
        "Alexa.EndpointHealth.connectivity"
      ],
      "displayCategories": ["SECURITY_PANEL"],
      "friendlyName": "Alarm Mode",
      "configuration": {
        "Alexa.SecurityPanelController": {
          "supportsArmInstant": false,
          "supportedArmStates": [
            {'value': 'ARMED_AWAY'}, {'value': 'ARMED_STAY'}, {'value': 'DISARMED'}
          ]
        }
      },
      "propertyMap": {
        "SecurityPanelController": {
          "armState": {
            "parameters": {
              "supportedArmStates": ["ARMED_AWAY", "ARMED_STAY", "DISARMED"]},
            "item": {"name": "AlarmMode3", "type": "String"},
            "schema": {"name": "armState"}
          }
        }
      }
    }
  }
};
